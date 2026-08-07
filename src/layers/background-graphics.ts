import { GraphicsLayer } from "./graphics-layer"
import { drawBackgroundPattern } from "./background-pattern"

export class BackgroundGraphics extends GraphicsLayer {
  constructor() {
    super(0)
  }

  update = (_dt: number) => {}

  draw = () => {
    drawBackgroundPattern(this.canvas)
  }
}
