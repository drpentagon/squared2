import { Ball } from "./ball"
import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { DOT_CC, TILE_CC, TILE_SIZE } from "./constants"
import { gridOrigin } from "./grid"
import { TileMap, pixelToTile } from "./tiles/tile"
import { Wall } from "./tiles/wall"
import { Redirector } from "./tiles/redirector"

const staticTiles = new TileMap()
staticTiles.set(new Wall(4, 5))
staticTiles.set(new Wall(8, 5))
staticTiles.set(new Wall(5, 9))
staticTiles.set(new Wall(6, 9))

const dynamicTiles = new TileMap()

const balls = [new Ball(3, 4, 0, -400)]

const backgroundGraphics = new BackgroundGraphics()
const staticGraphics = new StaticGraphics(staticTiles)
const dynamicGraphics = new DynamicGraphics(dynamicTiles, balls)

backgroundGraphics.draw()
staticGraphics.draw()

const stepMode = false
const STEP_DT = 1 / 60

let lastTime = 0

const loop = (timestamp: number) => {
  const dt = stepMode ? STEP_DT : (timestamp - lastTime) / 1000
  lastTime = timestamp

  balls.forEach((ball) => {
    staticTiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
    dynamicTiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
  })

  dynamicGraphics.update(dt)
  dynamicGraphics.draw()

  if (stepMode) setTimeout(() => requestAnimationFrame(loop), 2000)
  else requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

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
