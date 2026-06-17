import type { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DOT_CC, TILE_CC } from "../constants"

export const TILE_SIZE = TILE_CC * DOT_CC

export const pixelToTile = (pixel: number) =>
  Math.floor((pixel - DOT_CC) / TILE_SIZE)

export abstract class Tile {
  tileX: number
  tileY: number
  x: number
  y: number

  constructor(tileX: number, tileY: number) {
    this.tileX = tileX
    this.tileY = tileY
    this.x = (1 + tileX * TILE_CC) * DOT_CC
    this.y = (1 + tileY * TILE_CC) * DOT_CC
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

  forEach = (callback: (tile: Tile) => void) => {
    this.tiles.forEach((column) => column.forEach(callback))
  }
}
