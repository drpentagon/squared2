import { DOT_CC, TILE_SIZE, TOOL_SIZE, tileTypes } from "../lib/constants"
import { Redirector } from "../tiles/redirector"
import { RotatingTileTool } from "./rotating-tile-tool"

export class RedirectorTool extends RotatingTileTool<Redirector> {
  readonly type = tileTypes.REDIRECTOR
  protected offset = (TOOL_SIZE - TILE_SIZE) / 2 + DOT_CC
  protected readonly symbol = new Redirector(0, 0, 0)

  protected createTile = (tileX: number, tileY: number, variant: number) =>
    new Redirector(tileX, tileY, variant)

  protected rotate = (tile: Redirector) => {
    tile.variant = (tile.variant + 1) % 4
  }
}
