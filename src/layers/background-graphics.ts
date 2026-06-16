import { Canvas } from "../canvas"
import { GraphicsLayer } from "./graphics-layer"
import { Style } from "../style"
import { DOT_GRID_SIZE, DOT_SIZE, DOT_CC, TILES } from "../constants"
import { gridOrigin } from "../grid"

const dotStyle = new Style(
  "rgba(255, 255, 255, 0.10)",
  "rgba(255, 255, 255, 0.10)",
  1,
)
const patternStyle = new Style("rgba(255, 255, 255, 0.15)")

const TILE_PATTERN = [
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
]
const ODD_TILE_PATTERN = [
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
]

export class BackgroundGraphics extends GraphicsLayer {
  protected canvas: Canvas

  constructor() {
    super()
    this.canvas = new Canvas(0)
  }

  update = (_dt: number) => {}

  draw = () => {
    this.fillCells(0, 0, DOT_GRID_SIZE, DOT_GRID_SIZE, dotStyle)

    let odd = true
    for (let y = 0; y < TILES; y++) {
      for (let x = 0; x < TILES; x++) {
        const pattern = odd ? ODD_TILE_PATTERN : TILE_PATTERN

        pattern.forEach((r, py) =>
          r.forEach(
            (c, px) =>
              c &&
              this.fillCells(
                1 + x * 7 + px * 2,
                1 + y * 7 + py * 2,
                2,
                2,
                patternStyle,
              ),
          ),
        )
        odd = !odd
      }
    }
  }

  private fillCells = (
    col: number,
    row: number,
    width: number,
    height: number,
    style: Style,
  ) => {
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        this.canvas.drawSquare(
          gridOrigin.x + (col + c) * DOT_CC,
          gridOrigin.y + (row + r) * DOT_CC,
          DOT_SIZE,
          style,
        )
      }
    }
  }
}
