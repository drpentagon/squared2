import { Canvas } from "../canvas"

export class GraphicsLayer {
  protected canvas: Canvas

  constructor(layerLevel: number, modifier?: string) {
    this.canvas = new Canvas(layerLevel, document.body, modifier)
  }
  update = (_dt: number) => {}
  draw = () => {}
  clear = () => {
    this.canvas.clear()
  }
  destroy = () => {
    this.canvas.remove()
  }
}
