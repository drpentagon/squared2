import type { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_CC, BALL_RADIUS, TILE_CC, TILE_SIZE } from "../lib/constants"
import { Point } from "../lib/point"

export const pixelToTile = (pixel: Point): Point => ({
  x: Math.floor((pixel.x - DOT_CC) / TILE_CC),
  y: Math.floor((pixel.y - DOT_CC) / TILE_CC),
})

export abstract class Tile {
  tilePos: Point
  pos: Point
  consumed: boolean

  constructor(tilePos: Point) {
    this.tilePos = tilePos
    this.pos = {
      x: DOT_CC + tilePos.x * TILE_CC,
      y: DOT_CC + tilePos.y * TILE_CC,
    }
    this.consumed = false
  }

  overlap(ball: Ball) {
    if (ball.vx > 0) return ball.pos.x + BALL_RADIUS - this.pos.x
    if (ball.vx < 0) return this.pos.x + TILE_SIZE - ball.pos.x + BALL_RADIUS
    if (ball.vy > 0) return ball.pos.y + BALL_RADIUS - this.pos.y
    return this.pos.y + TILE_SIZE - ball.pos.y + BALL_RADIUS
  }

  onClick(): void {}

  abstract readonly type: string
  abstract draw(canvas: Canvas, origin?: Point): void
  abstract interact(ball: Ball): void
}

export class TileMap {
  private tiles = new Map<number, Map<number, Tile>>()

  set = (tile: Tile) => {
    if (!this.tiles.has(tile.tilePos.x)) this.tiles.set(tile.tilePos.x, new Map())
    this.tiles.get(tile.tilePos.x)!.set(tile.tilePos.y, tile)
  }

  addArray = (tiles: Tile[]) => {
    tiles.forEach(this.set)
  }

  get = (pos: Point) => this.tiles.get(pos.x)?.get(pos.y)

  delete = (pos: Point) => {
    this.tiles.get(pos.x)?.delete(pos.y)
  }

  clear = () => {
    this.tiles.clear()
  }

  forEach = (callback: (tile: Tile) => void) => {
    this.tiles.forEach((column) => column.forEach(callback))
  }
}
