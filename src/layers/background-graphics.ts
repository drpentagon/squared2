import { GraphicsLayer } from "./graphics-layer"
import { Style } from "../lib/style"
import { DOT_GRID_SIZE, DOT_CC, TILES } from "../lib/constants"
import { gridOrigin } from "../grid"

const dotStyle = new Style("rgba(255, 255, 255, 0.10)")
const primaryStyle = new Style("rgba(255, 255, 255, 0.05)")
const secondaryStyle = new Style("rgba(255, 255, 255, 0.10)")

const PRIMARY_PATTERN = [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
]
const SECONDARY_PATTERN = [
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 0],
]

export class BackgroundGraphics extends GraphicsLayer {
  constructor() {
    super(0)
  }

  update = (_dt: number) => {}

  draw = () => {
    this.canvas.fillDots(gridOrigin.x, gridOrigin.y, DOT_GRID_SIZE, DOT_GRID_SIZE, dotStyle)

    for (let y = 0; y < TILES; y++) {
      for (let x = 0; x < TILES; x++) {
        this.drawPattern(x, y, PRIMARY_PATTERN, primaryStyle)
        this.drawPattern(x, y, SECONDARY_PATTERN, secondaryStyle)
      }
    }
  }

  private drawPattern = (x: number, y: number, pattern: number[][], style: Style) => {
    pattern.forEach((r, py) =>
      r.forEach(
        (c, px) =>
          c &&
          this.canvas.fillDots(
            gridOrigin.x + (1 + x * 7 + px * 2) * DOT_CC,
            gridOrigin.y + (1 + y * 7 + py * 2) * DOT_CC,
            2,
            2,
            style,
          ),
      ),
    )
  }
}
