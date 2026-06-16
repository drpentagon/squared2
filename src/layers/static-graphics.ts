import { Canvas } from "../canvas"
import { Wall } from "../wall"
import { GraphicsLayer } from "./graphics-layer"

const walls = [new Wall(3, 3)]

export class StaticGraphics extends GraphicsLayer {
  protected canvas: Canvas

  constructor() {
    super()
    this.canvas = new Canvas(1)
  }

  update = (_dt: number) => {}

  draw = () => {
    walls.forEach((wall) => wall.draw(this.canvas))
  }
}
