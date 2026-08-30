import { RotatingTileTool } from "./rotating-tile-tool"
import { DOT, TILE, TOOL, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Redirector } from "../tiles/redirector"

export class RedirectorTool extends RotatingTileTool<Redirector> {
  readonly type = tileTypes.REDIRECTOR
  protected offset = (TOOL.SIZE - TILE.SIZE) / 2 + DOT.CC
  protected readonly symbol = new Redirector({ x: 0, y: 0 }, 0)

  protected createTile = (pos: Point, variant: number) => new Redirector(pos, variant)

  variantIndex = (tile: Redirector) => tile.variant

  setVariant = (tile: Redirector, variant: number) => {
    tile.variant = variant
  }
}
