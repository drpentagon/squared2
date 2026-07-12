import { Tile } from "../tiles/tile"
import { MaybeTile, Tool } from "./tool"

export abstract class RotatingTileTool<T extends Tile> extends Tool {
  private clickPosition: { tileX: number; tileY: number } | null = null
  private clickCount = 0

  protected abstract createTile(tileX: number, tileY: number, variant: number): T
  protected abstract rotate(tile: T): void

  protected matches = (tile: Tile): tile is T => tile.type === this.type

  execute = (tileX: number, tileY: number, variant: number, existingTile: MaybeTile) => {
    if (this.clickPosition?.tileX !== tileX || this.clickPosition?.tileY !== tileY) {
      this.clickPosition = { tileX, tileY }
      this.clickCount = 0
    }
    this.clickCount++

    if (!existingTile) return this.createTile(tileX, tileY, variant)

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
