import type { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_CC, BALL_RADIUS, TILE_CC, TILE_SIZE } from "../constants"
import { Style } from "../style"

export const pixelToTile = (pixel: number) => Math.floor((pixel - DOT_CC) / TILE_CC)

export abstract class Tile {
  tileX: number
  tileY: number
  x: number
  y: number
  style: Style
  consumed: boolean

  constructor(tileX: number, tileY: number) {
    this.tileX = tileX
    this.tileY = tileY
    this.x = DOT_CC + tileX * TILE_CC
    this.y = DOT_CC + tileY * TILE_CC

    this.style = new Style("rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 1)", 2)
    this.consumed = false
  }

  overlap(ball: Ball) {
    if (ball.vx > 0) return ball.x + BALL_RADIUS - this.x
    if (ball.vx < 0) return this.x + TILE_SIZE - ball.x + BALL_RADIUS
    if (ball.vy > 0) return ball.y + BALL_RADIUS - this.y
    return this.y + TILE_SIZE - ball.y + BALL_RADIUS
  }

  abstract draw(canvas: Canvas): void
  abstract interact(ball: Ball): void
}

export class TileMap {
  private tiles = new Map<number, Map<number, Tile>>()

  set = (tile: Tile) => {
    if (!this.tiles.has(tile.tileX)) this.tiles.set(tile.tileX, new Map())
    this.tiles.get(tile.tileX)!.set(tile.tileY, tile)
  }

  get = (tileX: number, tileY: number) => this.tiles.get(tileX)?.get(tileY)

  delete = (tileX: number, tileY: number) => {
    this.tiles.get(tileX)?.delete(tileY)
  }

  forEach = (callback: (tile: Tile) => void) => {
    this.tiles.forEach((column) => column.forEach(callback))
  }
}
