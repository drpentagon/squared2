import { MaybeTile, Tool } from "./tool"
import { Point } from "../lib/point"
import { Tile } from "../tiles/tile"

export abstract class RotatingTileTool<T extends Tile> extends Tool {
  private clickPos: Point | null = null
  private clickCount = 0

  protected abstract createTile(pos: Point, variant: number): T
  protected abstract rotate(tile: T): void

  protected matches = (tile: Tile): tile is T => tile.type === this.type

  execute = (pos: Point, variant: number, existingTile: MaybeTile) => {
    if (this.clickPos?.x !== pos.x || this.clickPos?.y !== pos.y) {
      this.clickPos = pos
      this.clickCount = 0
    }
    this.clickCount++

    if (!existingTile) return this.createTile(pos, variant)

    if (this.matches(existingTile)) {
      if (this.clickCount > 4) {
        this.clickCount = 0
        return
      }
      this.rotate(existingTile)
      return existingTile
    }

    return
  }
}
