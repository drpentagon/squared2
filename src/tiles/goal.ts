import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { TILE_SIZE, SQUARE_SIZE } from "../lib/constants"
import { rotatePolygon, DIRECTION_STEPS } from "../lib/geometry"
import { GOAL } from "../lib/styles"
import { playBounce, playBell } from "../lib/sound"
import { Tile } from "./tile"

const BASE: [number, number][] = [
  [0, 0],
  [SQUARE_SIZE, 0],
  [SQUARE_SIZE, TILE_SIZE - SQUARE_SIZE],
  [TILE_SIZE - SQUARE_SIZE, TILE_SIZE - SQUARE_SIZE],
  [TILE_SIZE - SQUARE_SIZE, 0],
  [TILE_SIZE, 0],
  [TILE_SIZE, TILE_SIZE],
  [0, TILE_SIZE],
]

const SHAPES = [0, 1, 2, 3].map((n) => rotatePolygon(BASE, n))

export class Goal extends Tile {
  direction: number

  constructor(tileX: number, tileY: number, direction: number) {
    super(tileX, tileY)
    this.direction = direction
  }

  interact = (ball: Ball) => {
    if (DIRECTION_STEPS.indexOf(ball.direction()) !== (this.direction + 2) % 4) {
      ball.perpendicularBounce(this.overlap(ball))
      playBounce()
      return
    }

    if (this.overlap(ball) >= TILE_SIZE / 2) {
      ball.consumed = true
      playBell()
    }
  }

  draw = (canvas: Canvas) => {
    canvas.drawPolygon(this, SHAPES[this.direction], GOAL)
  }
}
