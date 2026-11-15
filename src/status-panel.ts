import { viewport } from "./grid"
import { GraphicsLayer } from "./layers/graphics-layer"
import { BACKGROUND_DOT_STYLE } from "./lib/background-pattern"
import { DOT } from "./lib/constants"
import { DotRect, drawDotFrame, fillDotRect } from "./lib/dot-frame"
import { Style } from "./lib/style"
import { write } from "./lib/text"

const THICKNESS = 3
const TOP_ROW = -(THICKNESS + 1)
const LEFT_COL = -(THICKNESS + 1)

const TITLE = "squared"
const LETTER_STEP = 4

const METER_COUNT = 3
const METER_LENGTH = 12
const METER_GAP = 1
const METERS_OFFSET = DOT.GRID_SIZE - (METER_COUNT * METER_LENGTH + (METER_COUNT - 1) * METER_GAP)

const TEXT_STYLE = new Style("rgba(255, 255, 255, 0.5)")

class StatusPanel extends GraphicsLayer {
  constructor() {
    super(1, "status")
  }

  draw = () => {
    this.canvas.clear()
    fillDotRect(this.canvas, this.#strip(), BACKGROUND_DOT_STYLE)

    this.#writeTitle()

    for (let i = 0; i < METER_COUNT; i++) {
      drawDotFrame(this.canvas, this.#meter(i))
    }
  }

  #strip = (): DotRect =>
    viewport.landscape
      ? { col: LEFT_COL, row: 0, cols: THICKNESS, rows: DOT.GRID_SIZE }
      : { col: 0, row: TOP_ROW, cols: DOT.GRID_SIZE, rows: THICKNESS }

  #meter = (index: number): DotRect => {
    const offset = METERS_OFFSET + index * (METER_LENGTH + METER_GAP)

    return viewport.landscape
      ? { col: LEFT_COL, row: offset, cols: THICKNESS, rows: METER_LENGTH }
      : { col: offset, row: TOP_ROW, cols: METER_LENGTH, rows: THICKNESS }
  }

  #writeTitle = () => {
    if (!viewport.landscape) {
      write(this.canvas, TITLE, 0, TOP_ROW, TEXT_STYLE)
      return
    }

    TITLE.split("").forEach((letter, i) => {
      write(this.canvas, letter, LEFT_COL, i * LETTER_STEP, TEXT_STYLE)
    })
  }
}

export const statusPanel = new StatusPanel()
