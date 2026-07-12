import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import {
  BALL_RADIUS,
  DOT_SPACING,
  SQUARE_SIZE,
  SQUARE_STEP,
  TILE_SIZE,
  directions,
  tileTypes,
} from "../lib/constants"
import { rotatePolygon } from "../lib/geometry"
import { Point } from "../lib/point"
import { playBounce } from "../lib/sound"
import { Style } from "../lib/style"
import { ROCK } from "../lib/styles"
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
  readonly type = tileTypes.REDIRECTOR
  protected readonly style: Style = ROCK
  variant: number

  constructor(tilePos: Point, variant: number) {
    super(tilePos)
    this.variant = variant
  }

  protected onBounce() {
    playBounce()
  }

  interact = (ball: Ball) => {
    const overlap = this.overlap(ball)
    const nextDirection = REDIRECTS[this.variant][ball.direction()]

    if (ball.inNewTile() && !nextDirection) {
      ball.perpendicularBounce(overlap)
      this.onBounce()
      return
    }

    if (overlap <= 2 * SQUARE_STEP || !nextDirection) return

    const excess = overlap - 2 * SQUARE_STEP
    const speed = Math.abs(ball.vx) || Math.abs(ball.vy)

    const isPositive = nextDirection === RIGHT || nextDirection === DOWN
    const isHorizontal = nextDirection === RIGHT || nextDirection === LEFT
    const sign = isPositive ? 1 : -1
    const pos = isPositive
      ? TILE_SIZE - (SQUARE_STEP + SQUARE_SIZE) + excess + BALL_RADIUS
      : SQUARE_STEP + SQUARE_SIZE - excess - BALL_RADIUS

    if (isHorizontal) {
      ball.pos.x = this.pos.x + pos
      ball.vx = sign * speed
      ball.pos.y = this.pos.y + TILE_SIZE / 2
      ball.vy = 0
    } else {
      ball.pos.y = this.pos.y + pos
      ball.vy = sign * speed
      ball.pos.x = this.pos.x + TILE_SIZE / 2
      ball.vx = 0
    }
    this.onBounce()
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawPolygon(pos, VARIANTS[this.variant], this.style)
  }
}
