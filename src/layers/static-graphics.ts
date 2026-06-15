import { Canvas } from "../canvas"
import { GraphicsLayer } from "./graphics-layer"

export class StaticGraphics extends GraphicsLayer {
  protected canvas: Canvas

  constructor() {
    super()
    this.canvas = new Canvas(1)
  }

  update = (_dt: number) => {}
  draw = () => {}
}
