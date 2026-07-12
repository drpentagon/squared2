import { DOT_CC, GRID_SIZE, TILE_CC, TILE_SIZE } from "./lib/constants"
import { gridOrigin } from "./grid"
import { Level } from "./level"
import { pixelToTile } from "./tiles/tile"
import { setEditing, toolsPanel } from "./ui/tools-panel"
import level1 from "./levels/level1.json"

const level = new Level(level1)

let lastTime = 0

let EDITOR_STATE = false

const loop = (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  if (!EDITOR_STATE) {
    level.update(dt)
  } else {
    toolsPanel.render()
  }

  level.render()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

document.addEventListener("keydown", (e) => {
  if (e.key !== "e") return
  EDITOR_STATE = !EDITOR_STATE
  setEditing(EDITOR_STATE)
  if (EDITOR_STATE) level.reset()
})

const VARIANT_BY_QUADRANT = [
  [0, 1],
  [3, 2],
] as const

document.addEventListener("click", (e) => {
  const localX = e.clientX - gridOrigin.x
  const localY = e.clientY - gridOrigin.y
  if (localX < 0 || localX >= GRID_SIZE || localY < 0 || localY >= GRID_SIZE) return

  const tileX = pixelToTile(localX)
  const tileY = pixelToTile(localY)

  const tileOriginX = DOT_CC + tileX * TILE_CC
  const tileOriginY = DOT_CC + tileY * TILE_CC
  const col = localX - tileOriginX >= TILE_SIZE / 2 ? 1 : 0
  const row = localY - tileOriginY >= TILE_SIZE / 2 ? 1 : 0
  const variant = VARIANT_BY_QUADRANT[row][col]

  if (!EDITOR_STATE) {
    level.handlnteraction(tileX, tileY, variant)
  } else {
    const existingTile = level.getTile(tileX, tileY)
    const newTile = toolsPanel.executeSelectedTool(tileX, tileY, variant, existingTile)
    switch (true) {
      case existingTile?.type === toolsPanel.selectedTool?.type && !newTile:
        level.removeTile(tileX, tileY)
        break
      case !newTile:
        return
      default:
        level.addTile(tileX, tileY, newTile)
    }
  }
})
