import { Ball } from "./ball"
import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { TileMap, pixelToTile } from "./tile"
import { Wall } from "./wall"

const tiles = new TileMap()
tiles.set(new Wall(3, 9))
tiles.set(new Wall(4, 5))
tiles.set(new Wall(8, 5))
tiles.set(new Wall(5, 9))
tiles.set(new Wall(6, 9))

const balls = [
  new Ball(6, 3, 0, 200),
  new Ball(6, 5, 300, 0),
  new Ball(3, 2, 0, 400),
]

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
    const leadingX = ball.vx >= 0 ? ball.x + ball.size : ball.x
    const leadingY = ball.vy >= 0 ? ball.y + ball.size : ball.y

    tiles.get(pixelToTile(leadingX), pixelToTile(leadingY))?.interact(ball)
  })

  dynamicGraphics.draw()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
