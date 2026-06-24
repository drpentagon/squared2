import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_SPACING, SQUARE_SIZE } from "../constants"
import { rotatePolygon } from "../lib/geometry"
import { Tile } from "./tile"

const BASE: [number, number][] = [
  [0, 0],
  [2 * SQUARE_SIZE + DOT_SPACING, 0],
  [2 * SQUARE_SIZE + DOT_SPACING, SQUARE_SIZE],
  [SQUARE_SIZE, SQUARE_SIZE],
  [SQUARE_SIZE, 2 * SQUARE_SIZE + DOT_SPACING],
  [0, 2 * SQUARE_SIZE + DOT_SPACING],
]

const VARIANTS = [BASE, rotatePolygon(BASE, 1), rotatePolygon(BASE, 2), rotatePolygon(BASE, 3)]

export class Redirector extends Tile {
  interact = (ball: Ball) => {
    // console.log("REDIRECTOR / BALL INTERACTION", ball)
  }

  draw = (canvas: Canvas) => {
    canvas.drawPolygon(this, VARIANTS[1], this.style)
  }
}
