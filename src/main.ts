import { Ball } from "./ball"
import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { TileMap } from "./tiles/tile"
import { Wall } from "./tiles/wall"
import { Redirector } from "./tiles/redirector"

const tiles = new TileMap()
// tiles.set(new Wall(3, 9))
tiles.set(new Wall(4, 5))
tiles.set(new Wall(8, 5))
tiles.set(new Wall(5, 9))
tiles.set(new Wall(6, 9))
tiles.set(new Redirector(3, 3, 1))
tiles.set(new Redirector(7, 3, 0))
tiles.set(new Redirector(7, 9, 3))
tiles.set(new Redirector(4, 9, 2))
tiles.set(new Redirector(4, 6, 0))
tiles.set(new Redirector(8, 6, 1))

const balls = [new Ball(3, 5, 0, 400)]

const backgroundGraphics = new BackgroundGraphics()
const staticGraphics = new StaticGraphics(tiles)
const dynamicGraphics = new DynamicGraphics(balls)

backgroundGraphics.draw()
staticGraphics.draw()

let lastTime = 0

const loop = (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  dynamicGraphics.update(dt)

  balls.forEach((ball) => {
    tiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
  })

  dynamicGraphics.draw()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
