import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import { SQUARE, TILE, tileTypes } from "../lib/constants"
import { rotatePolygon, DIRECTION_STEPS } from "../lib/geometry"
import { Point } from "../lib/point"
import { playBounce, playBell } from "../lib/sound"
import { GOAL } from "../lib/styles"

const BASE: [number, number][] = [
  [0, 0],
  [SQUARE.SIZE, 0],
  [SQUARE.SIZE, TILE.SIZE - SQUARE.SIZE],
  [TILE.SIZE - SQUARE.SIZE, TILE.SIZE - SQUARE.SIZE],
  [TILE.SIZE - SQUARE.SIZE, 0],
  [TILE.SIZE, 0],
  [TILE.SIZE, TILE.SIZE],
  [0, TILE.SIZE],
]

const SHAPES = [0, 1, 2, 3].map((n) => rotatePolygon(BASE, n))

export class Goal extends Tile {
  readonly type = tileTypes.GOAL
  direction: number
  rotates: boolean

  constructor(tilePos: Point, direction: number, rotates = false) {
    super(tilePos)
    this.direction = direction
    this.rotates = rotates
  }

  interact = (ball: Ball) => {
    if (DIRECTION_STEPS.indexOf(ball.direction()) !== (this.direction + 2) % 4) {
      ball.perpendicularBounce(this.overlap(ball))
      playBounce()
      return
    }

    if (this.overlap(ball) >= TILE.SIZE / 2) {
      ball.consumed = true
      playBell()
      if (this.rotates) this.direction = (this.direction + 1) % 4
    }
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawPolygon(pos, SHAPES[this.direction], GOAL)
  }
}
