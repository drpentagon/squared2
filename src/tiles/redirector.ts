import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_SPACING, SQUARE_SIZE, SQUARE_STEP, TILE_SIZE, directions } from "../constants"
import { rotatePolygon } from "../lib/geometry"
import { playBounce } from "../sound"
import { FRAGILE, ROCK } from "../styles"
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
  variant: number
  permanent: boolean

  constructor(tileX: number, tileY: number, variant: number, permanent = false) {
    super(tileX, tileY)
    this.variant = variant
    this.permanent = permanent
  }

  interact = (ball: Ball) => {
    const overlap = this.overlap(ball)
    const nextDirection = REDIRECTS[this.variant][ball.direction()]

    if (!nextDirection) {
      if (ball.inNewTile()) ball.perpendicularBounce(overlap)
      if (!this.permanent) this.consumed = true
      playBounce()
      return
    }

    if (overlap <= 2 * SQUARE_STEP) return

    const excess = overlap - 2 * SQUARE_STEP
    const speed = Math.abs(ball.vx) || Math.abs(ball.vy)

    const isPositive = nextDirection === RIGHT || nextDirection === DOWN
    const isHorizontal = nextDirection === RIGHT || nextDirection === LEFT
    const sign = isPositive ? 1 : -1
    const pos = isPositive
      ? TILE_SIZE - (SQUARE_STEP + SQUARE_SIZE) + excess
      : SQUARE_STEP + SQUARE_SIZE - excess

    if (isHorizontal) {
      ball.x = this.x + pos
      ball.vx = sign * speed
      ball.y = this.y + TILE_SIZE / 2
      ball.vy = 0
    } else {
      ball.y = this.y + pos
      ball.vy = sign * speed
      ball.x = this.x + TILE_SIZE / 2
      ball.vx = 0
    }
    if (!this.permanent) this.consumed = true
    playBounce()
  }

  draw = (canvas: Canvas) => {
    canvas.drawPolygon(this, VARIANTS[this.variant], this.permanent ? ROCK : FRAGILE)
  }
}
