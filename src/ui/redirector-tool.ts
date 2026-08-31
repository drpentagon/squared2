import { RotatingTileTool } from "./rotating-tile-tool"
import { DIRECTIONS, DOT, TILE, TOOL, directions, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Redirector } from "../tiles/redirector"

export class RedirectorTool extends RotatingTileTool<Redirector> {
  readonly type = tileTypes.REDIRECTOR
  protected offset = (TOOL.SIZE - TILE.SIZE) / 2 + DOT.CC
  protected readonly symbol = new Redirector({ x: 0, y: 0 }, directions.UP)

  protected createTile = (pos: Point, variant: number) => new Redirector(pos, DIRECTIONS[variant])

  variantIndex = (tile: Redirector) => DIRECTIONS.indexOf(tile.direction)

  setVariant = (tile: Redirector, variant: number) => {
    tile.direction = DIRECTIONS[variant]
  }
}
