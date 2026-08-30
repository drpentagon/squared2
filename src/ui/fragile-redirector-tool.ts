import { RotatingTileTool } from "./rotating-tile-tool"
import { DOT, TILE, TOOL, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { FragileRedirector } from "../tiles/fragile-redirector"

export class FragileRedirectorTool extends RotatingTileTool<FragileRedirector> {
  readonly type = tileTypes.FRAGILE_REDIRECTOR
  protected offset = (TOOL.SIZE - TILE.SIZE) / 2 + DOT.CC
  protected readonly symbol = new FragileRedirector({ x: 0, y: 0 }, 0)

  protected createTile = (pos: Point, variant: number) => new FragileRedirector(pos, variant)

  variantIndex = (tile: FragileRedirector) => tile.variant

  setVariant = (tile: FragileRedirector, variant: number) => {
    tile.variant = variant
  }
}
