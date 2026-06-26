import { Canvas } from "./canvas"
import { DOT_CC, DOT_SIZE, GRID_SIZE, TILE_CC, directions } from "./constants"
import { gridOrigin } from "./grid"
import { Style } from "./style"
import { pixelToTile } from "./tiles/tile"

const { UP, DOWN, LEFT, RIGHT } = directions

const BALL_SIZE = DOT_SIZE + DOT_CC // 2 dots + 1 spacing = 15px

export class Ball {
  tilePosition: { x: number; y: number }
  size = BALL_SIZE
  x: number
  y: number
  vx: number
  vy: number
  isNewEntry = false

  constructor(tileX: number, tileY: number, vx: number, vy: number) {
    this.tilePosition = { x: tileX, y: tileY }
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

    this.tilePosition = { x: pixelToTile(this.x), y: pixelToTile(this.y) }
  }

  perpendicularBounce(overlap: number) {
    this.x -= Math.sign(this.vx) * overlap
    this.y -= Math.sign(this.vy) * overlap

    this.vx = -this.vx
    this.vy = -this.vy
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
