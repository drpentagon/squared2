import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import {
  BALL,
  DIRECTIONS,
  DOT,
  NEXT_DIRECTION,
  PREVIOUS_DIRECTION,
  SQUARE,
  TILE,
  directions,
  tileTypes,
} from "../lib/constants"
import { rotatePolygon } from "../lib/geometry"
import { Point } from "../lib/point"
import { playBounce } from "../lib/sound"
import { Style } from "../lib/style"
import { ROCK } from "../lib/styles"
const { DOWN, LEFT, RIGHT } = directions

const REDIRECTOR_SHAPE: [number, number][] = [
  [0, 0],
  [2 * SQUARE.SIZE + DOT.SPACING, 0],
  [2 * SQUARE.SIZE + DOT.SPACING, SQUARE.SIZE],
  [SQUARE.SIZE, SQUARE.SIZE],
  [SQUARE.SIZE, 2 * SQUARE.SIZE + DOT.SPACING],
  [0, 2 * SQUARE.SIZE + DOT.SPACING],
]

const SHAPE_ROTATIONS: Record<string, [number, number][]> = Object.fromEntries(
  DIRECTIONS.map((dir) => [dir, rotatePolygon(REDIRECTOR_SHAPE, dir)]),
)

export class Redirector extends Tile {
  readonly type = tileTypes.REDIRECTOR
  protected readonly style: Style = ROCK
  direction: string

  constructor(tilePos: Point, direction: string) {
    super(tilePos)
    this.direction = direction
  }

  protected onBounce() {
    playBounce()
  }

  interact = (ball: Ball) => {
    const overlap = this.overlap(ball)

    let nextDirection: string | undefined
    if (ball.direction === this.direction) {
      nextDirection = NEXT_DIRECTION[ball.direction]
    } else if (ball.direction === PREVIOUS_DIRECTION[this.direction]) {
      nextDirection = PREVIOUS_DIRECTION[ball.direction]
    }

    if (ball.inNewTile && !nextDirection) {
      ball.perpendicularBounce(overlap)
      this.onBounce()
      return
    }

    if (overlap <= 2 * SQUARE.STEP || !nextDirection) return

    const excess = overlap - 2 * SQUARE.STEP

    const isPositive = nextDirection === RIGHT || nextDirection === DOWN
    const isHorizontal = nextDirection === RIGHT || nextDirection === LEFT
    const pos = isPositive
      ? TILE.SIZE - (SQUARE.STEP + SQUARE.SIZE) + excess + BALL.RADIUS
      : SQUARE.STEP + SQUARE.SIZE - excess - BALL.RADIUS

    if (isHorizontal) {
      ball.pos.x = this.pos.x + pos
      ball.pos.y = this.pos.y + TILE.SIZE / 2
    } else {
      ball.pos.y = this.pos.y + pos
      ball.pos.x = this.pos.x + TILE.SIZE / 2
    }
    ball.direction = nextDirection
    this.onBounce()
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawPolygon(pos, SHAPE_ROTATIONS[this.direction], this.style)
  }
}
