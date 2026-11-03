import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import { NEXT_DIRECTION, OPPOSITE_DIRECTION, SQUARE, TILE, tileTypes } from "../lib/constants"
import { shapeRotations } from "../lib/geometry"
import { Point } from "../lib/point"
import { playBounce, playBell } from "../lib/sound"
import { GOAL } from "../lib/styles"

const GOAL_SHAPE: [number, number][] = [
  [0, 0],
  [SQUARE.SIZE, 0],
  [SQUARE.SIZE, TILE.SIZE - SQUARE.SIZE],
  [TILE.SIZE - SQUARE.SIZE, TILE.SIZE - SQUARE.SIZE],
  [TILE.SIZE - SQUARE.SIZE, 0],
  [TILE.SIZE, 0],
  [TILE.SIZE, TILE.SIZE],
  [0, TILE.SIZE],
]

const SHAPE = shapeRotations(GOAL_SHAPE)

export class Goal extends Tile {
  readonly type = tileTypes.GOAL
  direction: string
  rotates: boolean

  constructor(tilePos: Point, direction: string, rotates = false) {
    super(tilePos)
    this.direction = direction
    this.rotates = rotates
  }

  interact = (ball: Ball) => {
    if (OPPOSITE_DIRECTION[ball.direction] !== this.direction) {
      ball.perpendicularBounce(this.overlap(ball))
      playBounce()
      return
    }

    if (this.overlap(ball) >= TILE.SIZE / 2) {
      ball.consumed = true
      playBell()
      if (this.rotates) this.direction = NEXT_DIRECTION[this.direction]
    }
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawPolygon(pos, SHAPE.full[this.direction], GOAL)
  }

  renderMiniature = (canvas: Canvas, pos: Point) => {
    canvas.drawPolygon(pos, SHAPE.miniature[this.direction], GOAL)
  }
}
