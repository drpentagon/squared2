import { DOT_CC, TILE_SIZE, TOOL_SIZE, tileTypes } from "../lib/constants"
import { FragileRedirector } from "../tiles/fragile-redirector"
import { RotatingTileTool } from "./rotating-tile-tool"

export class FragileRedirectorTool extends RotatingTileTool<FragileRedirector> {
  readonly type = tileTypes.FRAGILE_REDIRECTOR
  protected offset = (TOOL_SIZE - TILE_SIZE) / 2 + DOT_CC
  protected readonly symbol = new FragileRedirector(0, 0, 0)

  protected createTile = (tileX: number, tileY: number, variant: number) =>
    new FragileRedirector(tileX, tileY, variant)

  protected rotate = (tile: FragileRedirector) => {
    tile.variant = (tile.variant + 1) % 4
  }
}
