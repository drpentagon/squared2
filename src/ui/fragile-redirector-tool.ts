import { RotatingTileTool } from "./rotating-tile-tool"
import { DOT_CC, TILE_SIZE, TOOL_SIZE, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { FragileRedirector } from "../tiles/fragile-redirector"

export class FragileRedirectorTool extends RotatingTileTool<FragileRedirector> {
  readonly type = tileTypes.FRAGILE_REDIRECTOR
  protected offset = (TOOL_SIZE - TILE_SIZE) / 2 + DOT_CC
  protected readonly symbol = new FragileRedirector({ x: 0, y: 0 }, 0)

  protected createTile = (pos: Point, variant: number) => new FragileRedirector(pos, variant)

  protected rotate = (tile: FragileRedirector) => {
    tile.variant = (tile.variant + 1) % 4
  }
}
