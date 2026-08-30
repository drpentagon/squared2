import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import { BALL, DOT, SQUARE, TILE, directions, tileTypes } from "../lib/constants"
import { rotatePolygon } from "../lib/geometry"
import { Point } from "../lib/point"
import { playBounce } from "../lib/sound"
import { Style } from "../lib/style"
import { ROCK } from "../lib/styles"
const { UP, DOWN, LEFT, RIGHT } = directions

const BASE: [number, number][] = [
  [0, 0],
  [2 * SQUARE.SIZE + DOT.SPACING, 0],
  [2 * SQUARE.SIZE + DOT.SPACING, SQUARE.SIZE],
  [SQUARE.SIZE, SQUARE.SIZE],
  [SQUARE.SIZE, 2 * SQUARE.SIZE + DOT.SPACING],
  [0, 2 * SQUARE.SIZE + DOT.SPACING],
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

    if (overlap <= 2 * SQUARE.STEP || !nextDirection) return

    const excess = overlap - 2 * SQUARE.STEP
    const speed = Math.abs(ball.vx) || Math.abs(ball.vy)

    const isPositive = nextDirection === RIGHT || nextDirection === DOWN
    const isHorizontal = nextDirection === RIGHT || nextDirection === LEFT
    const sign = isPositive ? 1 : -1
    const pos = isPositive
      ? TILE.SIZE - (SQUARE.STEP + SQUARE.SIZE) + excess + BALL.RADIUS
      : SQUARE.STEP + SQUARE.SIZE - excess - BALL.RADIUS

    if (isHorizontal) {
      ball.pos.x = this.pos.x + pos
      ball.vx = sign * speed
      ball.pos.y = this.pos.y + TILE.SIZE / 2
      ball.vy = 0
    } else {
      ball.pos.y = this.pos.y + pos
      ball.vy = sign * speed
      ball.pos.x = this.pos.x + TILE.SIZE / 2
      ball.vx = 0
    }
    this.onBounce()
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawPolygon(pos, VARIANTS[this.variant], this.style)
  }
}
