import { origin } from "./grid"
import { GraphicsLayer } from "./layers/graphics-layer"
import { DOT } from "./lib/constants"
import { Style } from "./lib/style"

const ROW = DOT.GRID_SIZE + 1

const LIT_STYLE = new Style("#ffffff")

class Timer extends GraphicsLayer {
  #duration = 0
  #remaining = 0

  constructor() {
    super(1)
  }

  get elapsed() {
    return this.#duration - this.#remaining
  }

  start = (duration: number) => {
    this.#duration = duration
    this.#remaining = duration
    this.clear()
  }

  update = (dt: number) => {
    this.#remaining = Math.max(0, this.#remaining - dt)
  }

  draw = (visible = false) => {
    this.canvas.clear()
    if (!visible || this.#remaining <= 0) return

    const lit = Math.ceil((this.#remaining / this.#duration) * DOT.GRID_SIZE)
    this.canvas.fillDots({ x: origin.x, y: origin.y + ROW * DOT.CC }, lit, 1, LIT_STYLE)
  }
}

export const timer = new Timer()
