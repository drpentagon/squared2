import { TileTool } from "./tile-tool"
import { GridObject } from "../grid-object"
import { tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Wall } from "../tiles/wall"

export class WallTool extends TileTool<Wall> {
  readonly type = tileTypes.WALL
  protected readonly symbol = new Wall({ x: 0, y: 0 })

  execute = (pos: Point, _variant: number, existingTile: GridObject | undefined) => {
    if (!existingTile) return new Wall(pos)
    return
  }
}
