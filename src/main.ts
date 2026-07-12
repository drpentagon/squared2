import { origin } from "./grid"
import { Level } from "./level"
import level1 from "./levels/level1.json"
import { DOT_CC, GRID_SIZE, TILE_CC, TILE_SIZE } from "./lib/constants"
import { Point } from "./lib/point"
import { pixelToTile } from "./tiles/tile"
import { setEditing, toolsPanel } from "./ui/tools-panel"

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
  const local: Point = { x: e.clientX - origin.x, y: e.clientY - origin.y }
  if (local.x < 0 || local.x >= GRID_SIZE || local.y < 0 || local.y >= GRID_SIZE) return

  const tilePos = pixelToTile(local)

  const tileOrigin: Point = {
    x: DOT_CC + tilePos.x * TILE_CC,
    y: DOT_CC + tilePos.y * TILE_CC,
  }
  const col = local.x - tileOrigin.x >= TILE_SIZE / 2 ? 1 : 0
  const row = local.y - tileOrigin.y >= TILE_SIZE / 2 ? 1 : 0
  const variant = VARIANT_BY_QUADRANT[row][col]

  if (!EDITOR_STATE) {
    level.handlnteraction(tilePos, variant)
  } else {
    const existingTile = level.getTile(tilePos)
    const newTile = toolsPanel.executeSelectedTool(tilePos, variant, existingTile)
    switch (true) {
      case existingTile?.type === toolsPanel.selectedTool?.type && !newTile:
        level.removeTile(tilePos)
        break
      case !newTile:
        return
      default:
        level.addTile(tilePos, newTile)
    }
  }
})
