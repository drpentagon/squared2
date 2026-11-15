import { GraphicsLayer } from "./layers/graphics-layer"
import { BACKGROUND_DOT_STYLE } from "./lib/background-pattern"
import { DOT } from "./lib/constants"
import { dotAt, drawDotFrame } from "./lib/dot-frame"
import { Style } from "./lib/style"
import { write } from "./lib/text"

const ROWS = 3
const TOP_ROW = -(ROWS + 1)

const RECT_COUNT = 3
const RECT_COLS = 12
const RECT_GAP = 1
const RECTS_LEFT = DOT.GRID_SIZE - (RECT_COUNT * RECT_COLS + (RECT_COUNT - 1) * RECT_GAP)

const TEXT_STYLE = new Style("#ffffff")

class StatusPanel extends GraphicsLayer {
  constructor() {
    super(1)
  }

  draw = () => {
    this.canvas.clear()
    this.canvas.fillDots(dotAt(0, TOP_ROW), DOT.GRID_SIZE, ROWS, BACKGROUND_DOT_STYLE)

    write(this.canvas, "squared", 0, TOP_ROW, TEXT_STYLE)

    for (let i = 0; i < RECT_COUNT; i++) {
      drawDotFrame(this.canvas, RECTS_LEFT + i * (RECT_COLS + RECT_GAP), TOP_ROW, RECT_COLS, ROWS)
    }
  }
}

export const statusPanel = new StatusPanel()
