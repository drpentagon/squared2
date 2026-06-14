import { Canvas } from "./canvas"
import { GraphicsLayer } from "./graphics-layer"

export class DynamicGraphics extends GraphicsLayer {
  protected canvas: Canvas

  constructor() {
    super()
    this.canvas = new Canvas(2)
  }

  update = (_dt: number) => {}
  draw = () => {}
}
