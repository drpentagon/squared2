import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_SPACING, SQUARE_SIZE, SQUARE_STEP, TILE_SIZE, directions } from "../constants"
import { rotatePolygon } from "../lib/geometry"
import { playBounce } from "../sound"
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

  constructor(tileX: number, tileY: number, variant: number) {
    super(tileX, tileY)
    this.variant = variant
  }

  interact = (ball: Ball) => {
    const overlap = this.overlap(ball)
    const nextDirection = REDIRECTS[this.variant][ball.direction()]

    if (!nextDirection) {
      if (ball.inNewTile()) ball.perpendicularBounce(overlap)
      playBounce()
      return
    }

    if (overlap <= 2 * SQUARE_STEP) return

    const excess = overlap - 2 * SQUARE_STEP
    const speed = Math.abs(ball.vx) || Math.abs(ball.vy)
    const center = (TILE_SIZE - ball.size) / 2

    if (ball.vx !== 0) {
      ball.x = this.x + center
      ball.vx = 0
    } else {
      ball.y = this.y + center
      ball.vy = 0
    }

    switch (nextDirection) {
      case RIGHT:
        ball.x = this.x + TILE_SIZE - ball.size + excess
        ball.vx = speed
        break
      case LEFT:
        ball.x = this.x - excess
        ball.vx = -speed
        break
      case DOWN:
        ball.y = this.y + TILE_SIZE - ball.size + excess
        ball.vy = speed
        break
      case UP:
        ball.y = this.y - excess
        ball.vy = -speed
        break
    }
    playBounce()
  }

  draw = (canvas: Canvas) => {
    canvas.drawPolygon(this, VARIANTS[this.variant], this.style)
  }
}
