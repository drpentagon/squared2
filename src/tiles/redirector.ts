import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_SPACING, SQUARE_SIZE, directions } from "../constants"
import { rotatePolygon } from "../lib/geometry"
import { Tile } from "./tile"
const { UP, DOWN, LEFT, RIGHT } = directions

const BASE: [number, number][] = [
  [0, 0],
  [2 * SQUARE_SIZE + DOT_SPACING, 0],
  [2 * SQUARE_SIZE + DOT_SPACING, SQUARE_SIZE],
  [SQUARE_SIZE, SQUARE_SIZE],
  [SQUARE_SIZE, 2 * SQUARE_SIZE + DOT_SPACING],
  [0, 2 * SQUARE_SIZE + DOT_SPACING],
]

const REDIRECTS = [
  { [UP]: RIGHT, [LEFT]: DOWN },
  { [RIGHT]: DOWN, [UP]: LEFT },
  { [DOWN]: LEFT, [RIGHT]: UP },
  { [DOWN]: RIGHT, [LEFT]: UP },
]

const VARIANTS = [BASE, rotatePolygon(BASE, 1), rotatePolygon(BASE, 2), rotatePolygon(BASE, 3)]

export class Redirector extends Tile {
  interact = (ball: Ball) => {
    const { overlapX, overlapY } = this.overlap(ball)
    const nextDirection = REDIRECTS[1][ball.direction()]

    if (!nextDirection) {
      ball.perpendicularBounce(overlapX, overlapY)
    }
  }

  draw = (canvas: Canvas) => {
    canvas.drawPolygon(this, VARIANTS[1], this.style)
  }
}
