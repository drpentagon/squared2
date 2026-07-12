import { GraphicsLayer } from "./graphics-layer"
import { origin } from "../grid"
import { DOT_GRID_SIZE, DOT_CC, TILES } from "../lib/constants"
import { Point } from "../lib/point"
import { Style } from "../lib/style"

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
    this.canvas.fillDots(origin, DOT_GRID_SIZE, DOT_GRID_SIZE, dotStyle)

    for (let y = 0; y < TILES; y++) {
      for (let x = 0; x < TILES; x++) {
        this.drawPattern({ x, y }, PRIMARY_PATTERN, primaryStyle)
        this.drawPattern({ x, y }, SECONDARY_PATTERN, secondaryStyle)
      }
    }
  }

  private drawPattern = (tilePos: Point, pattern: number[][], style: Style) => {
    pattern.forEach((r, py) =>
      r.forEach(
        (c, px) =>
          c &&
          this.canvas.fillDots(
            {
              x: origin.x + (1 + tilePos.x * 7 + px * 2) * DOT_CC,
              y: origin.y + (1 + tilePos.y * 7 + py * 2) * DOT_CC,
            },
            2,
            2,
            style,
          ),
      ),
    )
  }
}
