import { viewport } from "./grid"
import { GraphicsLayer } from "./layers/graphics-layer"
import { levelSequence } from "./level-sequence"
import { BACKGROUND_DOT_STYLE } from "./lib/background-pattern"
import { DOT } from "./lib/constants"
import { DotRect, FRAME_STYLE, fillDotRect } from "./lib/dot-frame"
import { drawNumberMeter } from "./lib/number-meter"

const THICKNESS = 3
const TOP_ROW = -(THICKNESS + 1)
const LEFT_COL = -(THICKNESS + 1)

const METER_LENGTH = 11
const METER_STEP = METER_LENGTH + 1

type Counter = { digits: number; atStart: boolean }

const REDIRECTS: Counter = { digits: 3, atStart: true }
const BOUNCES: Counter = { digits: 4, atStart: false }

const DIVIDER_LENGTH = 8

const counterLength = (digits: number) => digits * METER_STEP - 1

class StatusPanel extends GraphicsLayer {
  constructor() {
    super(1, "status")
  }

  draw = () => {
    const level = levelSequence.current

    this.canvas.clear()
    fillDotRect(this.canvas, this.#strip(), BACKGROUND_DOT_STYLE)

    drawNumberMeter(this.canvas, this.#meters(REDIRECTS), level.redirectsPlaced)
    fillDotRect(this.canvas, this.#divider(), FRAME_STYLE)
    drawNumberMeter(this.canvas, this.#meters(BOUNCES), level.bounces)
  }

  #strip = (): DotRect =>
    viewport.landscape
      ? { col: LEFT_COL, row: 0, cols: THICKNESS, rows: DOT.GRID_SIZE }
      : { col: 0, row: TOP_ROW, cols: DOT.GRID_SIZE, rows: THICKNESS }

  #meters = ({ digits, atStart }: Counter): DotRect[] => {
    const base = atStart ? 0 : DOT.GRID_SIZE - counterLength(digits)

    return Array.from({ length: digits }, (_, index) =>
      this.#slot(base + index * METER_STEP, METER_LENGTH),
    )
  }

  #divider = (): DotRect => {
    const start = counterLength(REDIRECTS.digits)
    const free = DOT.GRID_SIZE - counterLength(BOUNCES.digits) - start

    return this.#slot(start + Math.floor((free - DIVIDER_LENGTH) / 2), DIVIDER_LENGTH)
  }

  #slot = (along: number, length: number): DotRect =>
    viewport.landscape
      ? { col: LEFT_COL, row: along, cols: THICKNESS, rows: length }
      : { col: along, row: TOP_ROW, cols: length, rows: THICKNESS }
}

export const statusPanel = new StatusPanel()
