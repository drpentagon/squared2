import { origin } from "./grid"
import { Level } from "./level"
import { DialogueLayer } from "./layers/dialogue-layer"
import { DOT, GRID, TILE } from "./lib/constants"
import { Point } from "./lib/point"
import { pixelToTile } from "./tiles/tile"
import { tileEditPanel } from "./ui/tile-edit-panel"
import { setEditing, toolsPanel } from "./ui/tools-panel"

const levels = ["level0", "level1", "level2"]
let currentLevelIndex: number | null = null
let level: Level
let lastTime = 0
let EDITOR_STATE = false

const dialogueLayer = new DialogueLayer()

const loop = async (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  if (!EDITOR_STATE) {
    level.update(dt)
    if (level.finished) {
      await dialogueLayer.levelClear(level.elapsedTime, level.bounces, level.redirectsPlaced, 0)
      await loadNextLevel()
      lastTime = performance.now()
    }
  } else {
    toolsPanel.render()
  }

  const markedTile =
    EDITOR_STATE && level.markedTilePos ? level.getTile(level.markedTilePos) : undefined
  const markedTool = markedTile ? toolsPanel.findToolByType(markedTile.type) : undefined
  tileEditPanel.setContent(markedTool ?? null, markedTile ?? null)

  level.render(EDITOR_STATE)
  requestAnimationFrame(loop)
}

const loadNextLevel = async () => {
  level?.destroy()
  currentLevelIndex = currentLevelIndex === null ? 0 : currentLevelIndex + 1
  level = new Level(await import(`./levels/${levels[currentLevelIndex]}.json`))
}

dialogueLayer.title().then(() =>
  loadNextLevel().then(() => {
    // TEMPORARY: start directly in edit mode for the first level
    EDITOR_STATE = true
    setEditing(EDITOR_STATE)
    level.reset()
    requestAnimationFrame(loop)
  }),
)

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) lastTime = performance.now()
})
window.addEventListener("focus", () => {
  lastTime = performance.now()
})

const VARIANT_BY_QUADRANT = [
  [0, 1],
  [3, 2],
] as const

document.addEventListener("click", (e) => {
  const local: Point = { x: e.clientX - origin.x, y: e.clientY - origin.y }
  if (local.x < 0 || local.x >= GRID.SIZE || local.y < 0 || local.y >= GRID.SIZE) return

  const tilePos = pixelToTile(local)

  const tileOrigin: Point = {
    x: DOT.CC + tilePos.x * TILE.CC,
    y: DOT.CC + tilePos.y * TILE.CC,
  }
  const col = local.x - tileOrigin.x >= TILE.SIZE / 2 ? 1 : 0
  const row = local.y - tileOrigin.y >= TILE.SIZE / 2 ? 1 : 0
  const variant = VARIANT_BY_QUADRANT[row][col]

  if (!EDITOR_STATE) {
    level.handlnteraction(tilePos, variant)
  } else {
    const existingTile = level.getTile(tilePos)
    if (existingTile && existingTile.type !== toolsPanel.selectedTool?.type) {
      toolsPanel.selectToolForType(existingTile.type)
      level.markTile(tilePos)
      return
    }

    const newTile = toolsPanel.executeSelectedTool(tilePos, variant, existingTile)
    switch (true) {
      case existingTile?.type === toolsPanel.selectedTool?.type && !newTile:
        level.removeTile(tilePos)
        break
      case !newTile:
        return
      default:
        level.addTile(tilePos, newTile)
        level.markTile(tilePos)
    }
  }
})

toolsPanel.clearLevelTool.onClear = () => level.clear()

tileEditPanel.onDelete = () => {
  if (level.markedTilePos) level.removeTile(level.markedTilePos)
}

const copyButton = document.createElement("button")
copyButton.id = "copy-button"
copyButton.textContent = "Kopiera bana"
document.body.appendChild(copyButton)

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(JSON.stringify(level.serialize(), null, 2))
  const originalText = copyButton.textContent
  copyButton.textContent = "Kopierad!"
  setTimeout(() => {
    copyButton.textContent = originalText
  }, 1500)
})

document.addEventListener("keydown", (e) => {
  if (e.key !== "e") return
  EDITOR_STATE = !EDITOR_STATE
  setEditing(EDITOR_STATE)
  if (EDITOR_STATE) level.reset()
})
