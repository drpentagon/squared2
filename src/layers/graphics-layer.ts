import { Canvas } from "../canvas"

export class GraphicsLayer {
  protected canvas: Canvas

  constructor(layerLevel: number) {
    this.canvas = new Canvas(layerLevel)
  }
  update = (_dt: number) => {}
  draw = () => {}
  clear = () => {
    this.canvas.clear()
  }
}
