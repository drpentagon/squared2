import { origin } from "./grid"
import { GraphicsLayer } from "./layers/graphics-layer"
import { DOT } from "./lib/constants"
import { Style } from "./lib/style"

const ROW = DOT.GRID_SIZE + 1

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

  draw = (visible = false) => {
    this.canvas.clear()
    if (!visible || this.#remaining <= 0) return

    const lit = Math.ceil((this.#remaining / this.#duration) * DOT.GRID_SIZE)
    this.canvas.fillDots({ x: origin.x, y: origin.y + ROW * DOT.CC }, lit, 1, LIT_STYLE)
  }
}

export const timer = new Timer()
