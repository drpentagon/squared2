import { fetchLevel, fetchLevelIds } from "./api"
import { gameMode } from "./game-mode"
import { editMode } from "./edit-mode"
import { origin } from "./grid"
import { Level } from "./level"
import { DialogueLayer } from "./layers/dialogue-layer"
import { DOT, GRID, TILE } from "./lib/constants"
import { Point } from "./lib/point"
import { Mode } from "./mode"
import { pixelToTile } from "./tiles/tile"
import { setEditing } from "./ui/tools-panel"

let levelIds: number[] = []
let currentLevelIndex: number | null = null
let level: Level
let lastTime = 0
let EDITOR_STATE = false

const currentMode = (): Mode => (EDITOR_STATE ? editMode : gameMode)

const dialogueLayer = new DialogueLayer()

const loop = async (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  currentMode().update(dt)

  if (!EDITOR_STATE && level.finished) {
    await dialogueLayer.levelClear(level.elapsedTime, level.bounces, level.redirectsPlaced, 0)
    await loadNextLevel()
    lastTime = performance.now()
  }

  level.render(EDITOR_STATE)
  requestAnimationFrame(loop)
}

const loadNextLevel = async () => {
  level?.destroy()
  currentLevelIndex = currentLevelIndex === null ? 0 : currentLevelIndex + 1
  const id = levelIds[currentLevelIndex]
  level = new Level(id, await fetchLevel(id))
  gameMode.setLevel(level)
  editMode.setLevel(level)
}

dialogueLayer.title().then(async () => {
  levelIds = await fetchLevelIds()
  await loadNextLevel()
  // TEMPORARY: start directly in edit mode for the first level
  EDITOR_STATE = true
  setEditing(EDITOR_STATE)
  level.reset()
  requestAnimationFrame(loop)
})

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

  currentMode().handleClick(tilePos, variant)
})

document.addEventListener("keydown", (e) => {
  if (e.key !== "e") return
  EDITOR_STATE = !EDITOR_STATE
  setEditing(EDITOR_STATE)
  if (EDITOR_STATE) level.reset()
})
