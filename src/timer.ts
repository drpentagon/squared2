import { viewport } from "./grid"
import { GraphicsLayer } from "./layers/graphics-layer"
import { BACKGROUND_DOT_STYLE } from "./lib/background-pattern"
import { DOT } from "./lib/constants"
import { DotRect, drawDotFrame, fillDotRect } from "./lib/dot-frame"
import { Style } from "./lib/style"

const THICKNESS = 3
const TOP_ROW = DOT.GRID_SIZE + 1
const LEFT_COL = DOT.GRID_SIZE + 1
const INNER_LENGTH = DOT.GRID_SIZE - 2

const LIT_STYLE = new Style("rgba(255, 255, 255, 0.5)")

class Timer extends GraphicsLayer {
  #duration = 0
  #remaining = 0
  #onExpire: () => void = () => {}

  constructor() {
    super(1, "timer")
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
    const frame = this.#frame()

    this.canvas.clear()
    fillDotRect(this.canvas, frame, BACKGROUND_DOT_STYLE)
    drawDotFrame(this.canvas, frame)

    if (this.#remaining <= 0) return

    fillDotRect(this.canvas, this.#bar(this.#lit()), LIT_STYLE)
  }

  #frame = (): DotRect =>
    viewport.landscape
      ? { col: LEFT_COL, row: 0, cols: THICKNESS, rows: DOT.GRID_SIZE }
      : { col: 0, row: TOP_ROW, cols: DOT.GRID_SIZE, rows: THICKNESS }

  #bar = (lit: number): DotRect =>
    viewport.landscape
      ? { col: LEFT_COL + 1, row: DOT.GRID_SIZE - 1 - lit, cols: 1, rows: lit }
      : { col: 1, row: TOP_ROW + 1, cols: lit, rows: 1 }

  #lit = () => Math.ceil((this.#remaining / this.#duration) * INNER_LENGTH)
}

export const timer = new Timer()
