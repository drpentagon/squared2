import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { DOT_CC, TILE_CC, TILE_SIZE } from "./lib/constants"
import { gridOrigin } from "./grid"
import { Level } from "./level"
import { Tile, pixelToTile } from "./tiles/tile"
import { Redirector } from "./tiles/redirector"
import { optionsPanel, setEditing, toolsPanel } from "./ui/panels"
import level1 from "./levels/level1.json"

const level = new Level(level1)

const balls = level.balls
const staticTiles = level.staticTiles
const dynamicTiles = level.dynamicTiles

const backgroundGraphics = new BackgroundGraphics()
const staticGraphics = new StaticGraphics(staticTiles)
const dynamicGraphics = new DynamicGraphics(dynamicTiles, balls)

backgroundGraphics.draw()
staticGraphics.draw()

const stepMode = false
const STEP_DT = 1 / 60

let lastTime = 0
let isEditing = false

const resetToInitialState = () => {
  const fresh = new Level(level1)

  balls.splice(0, balls.length, ...fresh.balls)

  const freshDynamicTiles: Tile[] = []
  fresh.dynamicTiles.forEach((tile) => freshDynamicTiles.push(tile))
  dynamicTiles.clear()
  dynamicTiles.addArray(freshDynamicTiles)
}

const loop = (timestamp: number) => {
  const dt = stepMode ? STEP_DT : (timestamp - lastTime) / 1000
  lastTime = timestamp

  if (!isEditing) {
    balls.forEach((ball) => {
      staticTiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
      dynamicTiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
    })

    dynamicGraphics.update(dt)
  } else {
    toolsPanel.render()
    optionsPanel.render()
  }

  dynamicGraphics.draw()

  if (stepMode) setTimeout(() => requestAnimationFrame(loop), 2000)
  else requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

document.addEventListener("keydown", (e) => {
  if (e.key !== "e") return
  isEditing = !isEditing
  setEditing(isEditing)
  if (isEditing) resetToInitialState()
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

  const existing = staticTiles.get(tileX, tileY) ?? dynamicTiles.get(tileX, tileY)
  if (existing) {
    existing.onClick()
    return
  }

  if (balls.some((ball) => ball.tilePosition.x === tileX && ball.tilePosition.y === tileY)) return

  const tileOriginX = DOT_CC + tileX * TILE_CC
  const tileOriginY = DOT_CC + tileY * TILE_CC
  const col = localX - tileOriginX >= TILE_SIZE / 2 ? 1 : 0
  const row = localY - tileOriginY >= TILE_SIZE / 2 ? 1 : 0
  const variant = VARIANT_BY_QUADRANT[row][col]

  dynamicTiles.set(new Redirector(tileX, tileY, variant))
})
