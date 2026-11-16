import { Canvas } from "../canvas"
import { DotRect, drawDotFrame, fillDotRect } from "./dot-frame"
import { Style } from "./style"

const LIT_STYLE = new Style("rgba(255, 255, 255, 0.5)")

export const drawNumberMeter = (canvas: Canvas, meters: DotRect[], value: number) => {
  const digits = digitsOf(value, meters.length)
  if (!vertical(meters[0])) digits.reverse()

  meters.forEach((meter, index) => {
    drawDotFrame(canvas, meter)

    const digit = digits[index]
    if (digit === 0) return

    fillDotRect(canvas, litDots(meter, digit), LIT_STYLE)
  })
}

const digitsOf = (value: number, count: number) =>
  String(Math.max(0, Math.min(Math.floor(value), 10 ** count - 1)))
    .padStart(count, "0")
    .split("")
    .map(Number)

const vertical = ({ cols, rows }: DotRect) => rows > cols

const litDots = (meter: DotRect, digit: number): DotRect => {
  const { col, row, cols, rows } = meter

  return vertical(meter)
    ? { col: col + 1, row: row + rows - 1 - digit, cols: 1, rows: digit }
    : { col: col + 1, row: row + 1, cols: digit, rows: 1 }
}
