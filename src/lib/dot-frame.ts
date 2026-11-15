import { Canvas } from "../canvas"
import { origin } from "../grid"
import { DOT } from "./constants"
import { Point } from "./point"
import { Style } from "./style"

export const FRAME_STYLE = new Style("rgba(255, 255, 255, 0.10)")

export type DotRect = { col: number; row: number; cols: number; rows: number }

export const drawDotFrame = (canvas: Canvas, { col, row, cols, rows }: DotRect) => {
  canvas.fillDots(dotAt(col, row), cols, 1, FRAME_STYLE)
  canvas.fillDots(dotAt(col, row + rows - 1), cols, 1, FRAME_STYLE)

  for (let r = row + 1; r < row + rows - 1; r++) {
    canvas.fillDots(dotAt(col, r), 1, 1, FRAME_STYLE)
    canvas.fillDots(dotAt(col + cols - 1, r), 1, 1, FRAME_STYLE)
  }
}

export const fillDotRect = (canvas: Canvas, { col, row, cols, rows }: DotRect, style: Style) => {
  canvas.fillDots(dotAt(col, row), cols, rows, style)
}

const dotAt = (col: number, row: number): Point => ({
  x: origin.x + col * DOT.CC,
  y: origin.y + row * DOT.CC,
})
