import { Canvas } from "../canvas"
import { origin } from "../grid"
import { DOT_CC, DOT_SIZE, DOT_SPACING, TILE_CC, TILE_SIZE } from "./constants"
import { Point } from "./point"
import { Style } from "./style"

const CELL_SIZE = DOT_CC + DOT_SIZE

const TEXT_STYLE = new Style("rgba(255, 255, 255, 0.8)")

const letters: Record<string, number> = {
  A: 0b010111101,
  B: 0b110111111,
  C: 0b111100111,
  D: 0b110101110,
  E: 0b111110111,
  F: 0b111110100,
  G: 0b110101111,
  H: 0b101111101,
  I: 0b111010111,
  J: 0b001101111,
  K: 0b101110101,
  L: 0b100100111,
  M: 0b111111101,
  N: 0b111101101,
  O: 0b111101111,
  P: 0b111111100,
  Q: 0b111111001,
  R: 0b111100100,
  S: 0b011010110,
  T: 0b111010010,
  U: 0b101101111,
  V: 0b101101010,
  W: 0b101111111,
  X: 0b101010101,
  Y: 0b101010010,
  Z: 0b110010011,
  " ": 0b000000000,
  ".": 0b000000100,
  ":": 0b010000010,
  "!": 0b011001010,
  "0": 0b111101111,
  "1": 0b110010111,
  "2": 0b110010011,
  "3": 0b111011111,
  "4": 0b101111001,
  "5": 0b011010110,
  "6": 0b100111111,
  "7": 0b111001001,
  "8": 0b011111111,
  "9": 0b111111001,
}

export const stringLength = (text: string): number =>
  text
    .toUpperCase()
    .split("")
    .filter((ch) => letters[ch] !== undefined).length

export const write = (canvas: Canvas, text: string, x: number, y: number) =>
  writeText(canvas, text, x, y, DOT_CC * 4, DOT_SIZE, DOT_SPACING)

export const writeHeadline = (canvas: Canvas, text: string, x: number, y: number) =>
  writeText(canvas, text, x, y, TILE_CC, CELL_SIZE, DOT_SPACING)

export const writeHuge = (canvas: Canvas, text: string, x: number, y: number) =>
  writeText(canvas, text, x, y, TILE_CC * 4, TILE_SIZE, DOT_CC + DOT_SPACING)

export const writeMini = (canvas: Canvas, text: string, x: number, y: number) =>
  writeText(canvas, text, x, y, 8, 2, 0)

export const writeEnormous = (canvas: Canvas, letter: string) =>
  writeText(canvas, letter, 15, 15, TILE_CC * 2 + 6 * DOT_CC, DOT_CC + DOT_SPACING, 0)

const writeText = (
  canvas: Canvas,
  text: string,
  x: number,
  y: number,
  step: number,
  pixelSize: number,
  spacing: number,
) => {
  const base: Point = { x: origin.x + x * DOT_CC, y: origin.y + y * DOT_CC }
  let i = 0
  text
    .toUpperCase()
    .split("")
    .forEach((ch) => {
      const drawn = writeLetter(canvas, ch, { x: base.x + i * step, y: base.y }, pixelSize, spacing)
      if (drawn) i++
    })
}

const writeLetter = (
  canvas: Canvas,
  letter: string,
  pos: Point,
  pixelSize: number,
  spacing = 0,
): boolean => {
  const pattern = letters[letter]
  if (pattern === undefined) return false

  for (let bit = 0; bit < 9; bit++) {
    if ((pattern >> bit) & 1) {
      const index = 8 - bit
      const col = index % 3
      const row = Math.floor(index / 3)
      canvas.drawSquare(
        { x: pos.x + col * (pixelSize + spacing), y: pos.y + row * (pixelSize + spacing) },
        pixelSize,
        TEXT_STYLE,
      )
    }
  }
  return true
}
