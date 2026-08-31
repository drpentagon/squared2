import { Canvas } from "../canvas"
import { origin } from "../grid"
import { DOT, TILE } from "./constants"
import { Point } from "./point"
import { Style } from "./style"

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

export const drawBackgroundPattern = (canvas: Canvas) => {
  canvas.fillDots(origin, DOT.GRID_SIZE, DOT.GRID_SIZE, dotStyle)

  for (let y = 0; y < TILE.COUNT; y++) {
    for (let x = 0; x < TILE.COUNT; x++) {
      drawPattern(canvas, { x, y }, PRIMARY_PATTERN, primaryStyle)
      drawPattern(canvas, { x, y }, SECONDARY_PATTERN, secondaryStyle)
    }
  }
}

const drawPattern = (canvas: Canvas, tilePos: Point, pattern: number[][], style: Style) => {
  pattern.forEach((r, py) =>
    r.forEach(
      (c, px) =>
        c &&
        canvas.fillDots(
          {
            x: origin.x + (1 + tilePos.x * 7 + px * 2) * DOT.CC,
            y: origin.y + (1 + tilePos.y * 7 + py * 2) * DOT.CC,
          },
          2,
          2,
          style,
        ),
    ),
  )
}
