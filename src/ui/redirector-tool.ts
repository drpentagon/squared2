import { RotatingTileTool } from "./rotating-tile-tool"
import { DOT_CC, TILE_SIZE, TOOL_SIZE, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Redirector } from "../tiles/redirector"

export class RedirectorTool extends RotatingTileTool<Redirector> {
  readonly type = tileTypes.REDIRECTOR
  protected offset = (TOOL_SIZE - TILE_SIZE) / 2 + DOT_CC
  protected readonly symbol = new Redirector({ x: 0, y: 0 }, 0)

  protected createTile = (pos: Point, variant: number) => new Redirector(pos, variant)

  protected rotate = (tile: Redirector) => {
    tile.variant = (tile.variant + 1) % 4
  }
}
