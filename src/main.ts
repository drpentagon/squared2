import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"

const backgroundGraphics = new BackgroundGraphics()
const staticGraphics = new StaticGraphics()
const dynamicGraphics = new DynamicGraphics()

backgroundGraphics.draw()
staticGraphics.draw()

let lastTime = 0

const loop = (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  dynamicGraphics.update(dt)
  dynamicGraphics.draw()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
