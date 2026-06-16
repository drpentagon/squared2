import { Canvas } from "./canvas"
import { DOT_CC, DOT_SIZE, GRID_SIZE, TILE_CC } from "./constants"
import { gridOrigin } from "./grid"
import { Style } from "./style"
import { pixelToTile } from "./tile"

const BALL_SIZE = DOT_SIZE + DOT_CC // 2 dots + 1 spacing = 15px

export class Ball {
  tilePosition: { x: number; y: number }
  size = BALL_SIZE
  x: number
  y: number
  vx: number
  vy: number

  constructor(tileX: number, tileY: number, vx: number, vy: number) {
    this.tilePosition = { x: tileX, y: tileY }
    this.vx = vx
    this.vy = vy

    this.x = (1 + tileX * TILE_CC + 2) * DOT_CC
    this.y = (1 + tileY * TILE_CC + 2) * DOT_CC
  }

  update(dt: number) {
    this.x += this.vx * dt
    this.y += this.vy * dt

    this.x = ((this.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE
    this.y = ((this.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE

    this.tilePosition = { x: pixelToTile(this.x), y: pixelToTile(this.y) }
  }

  draw(canvas: Canvas) {
    canvas.drawSquare(
      gridOrigin.x + this.x,
      gridOrigin.y + this.y,
      this.size,
      new Style(),
    )
  }
}
