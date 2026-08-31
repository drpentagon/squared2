import { RotatingTileTool } from "./rotating-tile-tool"
import { DIRECTIONS, DOT, TILE, TOOL, directions, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { FragileRedirector } from "../tiles/fragile-redirector"

export class FragileRedirectorTool extends RotatingTileTool<FragileRedirector> {
  readonly type = tileTypes.FRAGILE_REDIRECTOR
  protected offset = (TOOL.SIZE - TILE.SIZE) / 2 + DOT.CC
  protected readonly symbol = new FragileRedirector({ x: 0, y: 0 }, directions.UP)

  protected createTile = (pos: Point, variant: number) =>
    new FragileRedirector(pos, DIRECTIONS[variant])

  variantIndex = (tile: FragileRedirector) => DIRECTIONS.indexOf(tile.direction)

  setVariant = (tile: FragileRedirector, variant: number) => {
    tile.direction = DIRECTIONS[variant]
  }
}
