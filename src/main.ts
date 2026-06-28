import { Ball } from "./ball"
import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { TileMap } from "./tiles/tile"
import { Wall } from "./tiles/wall"
import { Redirector } from "./tiles/redirector"

const staticTiles = new TileMap()
// staticTiles.set(new Wall(3, 9))
staticTiles.set(new Wall(4, 5))
staticTiles.set(new Wall(8, 5))
staticTiles.set(new Wall(5, 9))
staticTiles.set(new Wall(6, 9))

const dynamicTiles = new TileMap()
dynamicTiles.set(new Redirector(3, 3, 1))
dynamicTiles.set(new Redirector(7, 3, 0))
dynamicTiles.set(new Redirector(7, 9, 3))
dynamicTiles.set(new Redirector(4, 9, 2))
dynamicTiles.set(new Redirector(4, 6, 0))
dynamicTiles.set(new Redirector(8, 6, 1))

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
