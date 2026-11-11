import { GraphicsLayer } from "./graphics-layer"
import { origin } from "../grid"
import { DOT, TIMER } from "../lib/constants"
import { Style } from "../lib/style"

const LIT_STYLE = new Style("#ffffff")

export class TimerGraphics extends GraphicsLayer {
  constructor() {
    super(1)
  }

  draw = (remaining = 0) => {
    this.canvas.clear()

    const lit = Math.ceil(remaining * DOT.GRID_SIZE)
    if (lit <= 0) return

    this.canvas.fillDots({ x: origin.x, y: origin.y + TIMER.ROW * DOT.CC }, lit, 1, LIT_STYLE)
  }
}
