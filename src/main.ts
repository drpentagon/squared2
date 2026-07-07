import { DOT_CC, TILE_CC, TILE_SIZE } from "./lib/constants"
import { gridOrigin } from "./grid"
import { Level } from "./level"
import { pixelToTile } from "./tiles/tile"
import { optionsPanel, setEditing, toolsPanel } from "./ui/panels"
import level1 from "./levels/level1.json"

const level = new Level(level1)
// level.reset()

let lastTime = 0
let isEditing = false

let EDITOR_STATE = false

const loop = (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  if (!isEditing) {
    level.update(dt)
  } else {
    toolsPanel.render()
    optionsPanel.render()
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
  const tileX = pixelToTile(localX)
  const tileY = pixelToTile(localY)

  const tileOriginX = DOT_CC + tileX * TILE_CC
  const tileOriginY = DOT_CC + tileY * TILE_CC
  const col = localX - tileOriginX >= TILE_SIZE / 2 ? 1 : 0
  const row = localY - tileOriginY >= TILE_SIZE / 2 ? 1 : 0
  const variant = VARIANT_BY_QUADRANT[row][col]

  level.handlnteraction(tileX, tileY, variant)
})
