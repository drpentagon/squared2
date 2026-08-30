import type { Ball } from "../ball"
import { Canvas } from "../canvas"
import { BALL, DOT, TILE } from "../lib/constants"
import { Point } from "../lib/point"

export const pixelToTile = (pixel: Point): Point => ({
  x: Math.floor((pixel.x - DOT.CC) / TILE.CC),
  y: Math.floor((pixel.y - DOT.CC) / TILE.CC),
})

export abstract class Tile {
  tilePos: Point
  pos: Point
  consumed: boolean

  constructor(tilePos: Point) {
    this.tilePos = tilePos
    this.pos = {
      x: DOT.CC + tilePos.x * TILE.CC,
      y: DOT.CC + tilePos.y * TILE.CC,
    }
    this.consumed = false
  }

  overlap(ball: Ball) {
    if (ball.vx > 0) return ball.pos.x + BALL.RADIUS - this.pos.x
    if (ball.vx < 0) return this.pos.x + TILE.SIZE - ball.pos.x + BALL.RADIUS
    if (ball.vy > 0) return ball.pos.y + BALL.RADIUS - this.pos.y
    return this.pos.y + TILE.SIZE - ball.pos.y + BALL.RADIUS
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
