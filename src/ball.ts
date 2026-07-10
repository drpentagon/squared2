import { Canvas } from "./canvas"
import {
  BALL_SIZE,
  DOT_CC,
  GRID_SIZE,
  BALL_RADIUS,
  TILE_CC,
  directions,
  tileTypes,
} from "./lib/constants"
import { gridOrigin } from "./grid"
import { BALL_STYLE } from "./lib/styles"
import { pixelToTile } from "./tiles/tile"

const { UP, DOWN, LEFT, RIGHT } = directions

export class Ball {
  tilePosition: { x: number; y: number }
  oldTilePosition: { x: number; y: number }
  x: number
  y: number
  vx: number
  vy: number
  consumed: boolean

  constructor(tileX: number, tileY: number, vx: number, vy: number) {
    this.tilePosition = { x: tileX, y: tileY }
    this.oldTilePosition = { x: -1, y: -1 }
    this.vx = vx
    this.vy = vy
    this.consumed = false

    this.x = 3 * DOT_CC + tileX * TILE_CC + BALL_RADIUS
    this.y = 3 * DOT_CC + tileY * TILE_CC + BALL_RADIUS
  }

  get type() {
    return tileTypes.BALL
  }

  update(dt: number) {
    this.x += this.vx * dt
    this.y += this.vy * dt

    this.x = ((this.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE
    this.y = ((this.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE

    const leadingX = this.vx >= 0 ? this.x + BALL_RADIUS : this.x - BALL_RADIUS
    const leadingY = this.vy >= 0 ? this.y + BALL_RADIUS : this.y - BALL_RADIUS

    this.oldTilePosition = { x: this.tilePosition.x, y: this.tilePosition.y }
    this.tilePosition = { x: pixelToTile(leadingX), y: pixelToTile(leadingY) }
  }

  perpendicularBounce(overlap: number) {
    this.x -= Math.sign(this.vx) * overlap
    this.y -= Math.sign(this.vy) * overlap

    this.vx = -this.vx
    this.vy = -this.vy
  }

  inNewTile() {
    return (
      this.oldTilePosition.x !== this.tilePosition.x ||
      this.oldTilePosition.y !== this.tilePosition.y
    )
  }

  direction() {
    if (this.vy < 0) return UP
    if (this.vy > 0) return DOWN
    if (this.vx > 0) return RIGHT
    return LEFT
  }

  draw(canvas: Canvas) {
    canvas.drawSquare(
      gridOrigin.x + this.x - BALL_RADIUS,
      gridOrigin.y + this.y - BALL_RADIUS,
      BALL_SIZE,
      BALL_STYLE,
    )
  }
}
