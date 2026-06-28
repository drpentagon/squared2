import { Canvas } from "./canvas"
import { DOT_CC, DOT_SIZE, GRID_SIZE, TILE_CC, directions } from "./constants"
import { gridOrigin } from "./grid"
import { Style } from "./style"
import { pixelToTile } from "./tiles/tile"

const { UP, DOWN, LEFT, RIGHT } = directions

const BALL_SIZE = DOT_SIZE + DOT_CC // 2 dots + 1 spacing = 15px

export class Ball {
  tilePosition: { x: number; y: number }
  oldTilePosition: { x: number; y: number }
  size = BALL_SIZE
  x: number
  y: number
  vx: number
  vy: number

  constructor(tileX: number, tileY: number, vx: number, vy: number) {
    this.tilePosition = { x: tileX, y: tileY }
    this.oldTilePosition = { x: -1, y: -1 }
    this.vx = vx
    this.vy = vy

    this.x = 3 * DOT_CC + tileX * TILE_CC
    this.y = 3 * DOT_CC + tileY * TILE_CC
  }

  update(dt: number) {
    this.x += this.vx * dt
    this.y += this.vy * dt

    this.x = ((this.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE
    this.y = ((this.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE

    const leadingX = this.vx >= 0 ? this.x + this.size : this.x
    const leadingY = this.vy >= 0 ? this.y + this.size : this.y

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
    canvas.drawSquare(gridOrigin.x + this.x, gridOrigin.y + this.y, this.size, new Style())
  }
}
