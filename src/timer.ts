import { GraphicsLayer } from "./layers/graphics-layer"
import { DOT } from "./lib/constants"
import { dotAt, drawDotFrame } from "./lib/dot-frame"
import { Style } from "./lib/style"

const ROWS = 3
const TOP_ROW = DOT.GRID_SIZE + 1
const INNER_COLS = DOT.GRID_SIZE - 2

const LIT_STYLE = new Style("#ffffff")

class Timer extends GraphicsLayer {
  #duration = 0
  #remaining = 0
  #onExpire: () => void = () => {}

  constructor() {
    super(1)
  }

  get elapsed() {
    return this.#duration - this.#remaining
  }

  start = (duration: number, onExpire: () => void) => {
    this.#duration = duration
    this.#remaining = duration
    this.#onExpire = onExpire
    this.clear()
  }

  update = (dt: number) => {
    if (this.#remaining === 0) return

    this.#remaining = Math.max(0, this.#remaining - dt)
    if (this.#remaining === 0) this.#onExpire()
  }

  draw = () => {
    this.canvas.clear()
    drawDotFrame(this.canvas, 0, TOP_ROW, DOT.GRID_SIZE, ROWS)
    if (this.#remaining <= 0) return

    const lit = Math.ceil((this.#remaining / this.#duration) * INNER_COLS)
    this.canvas.fillDots(dotAt(1, TOP_ROW + 1), lit, 1, LIT_STYLE)
  }
}

export const timer = new Timer()
