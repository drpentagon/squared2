import { TileTool } from "./tile-tool"
import { GridObject } from "../grid-object"
import { tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Burner } from "../tiles/burner"

export class BurnerTool extends TileTool<Burner> {
  readonly type = tileTypes.BURNER
  protected readonly symbol = new Burner({ x: 0, y: 0 })

  execute = (pos: Point, _variant: number, existingTile: GridObject | undefined) => {
    if (!existingTile) return new Burner(pos)
    return
  }
}
