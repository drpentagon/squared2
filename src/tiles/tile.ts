import type { Ball } from "../ball"
import { GridObject } from "../grid-object"
import { BALL, DOT, TILE, directions } from "../lib/constants"
import { Point } from "../lib/point"

const { DOWN, LEFT, RIGHT } = directions

export const pixelToTile = (pixel: Point): Point => ({
  x: Math.floor((pixel.x - DOT.CC) / TILE.CC),
  y: Math.floor((pixel.y - DOT.CC) / TILE.CC),
})

export abstract class Tile extends GridObject {
  constructor(tilePos: Point) {
    super(tilePos, {
      x: DOT.CC + tilePos.x * TILE.CC,
      y: DOT.CC + tilePos.y * TILE.CC,
    })
  }

  overlap(ball: Ball) {
    if (ball.direction === RIGHT) return ball.pos.x + BALL.RADIUS - this.pos.x
    if (ball.direction === LEFT) return this.pos.x + TILE.SIZE - ball.pos.x + BALL.RADIUS
    if (ball.direction === DOWN) return ball.pos.y + BALL.RADIUS - this.pos.y
    return this.pos.y + TILE.SIZE - ball.pos.y + BALL.RADIUS
  }

  onClick(): void {}

  abstract interact(ball: Ball): void
}
