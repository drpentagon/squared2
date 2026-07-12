import { MaybeTile, Tool } from "./tool"
import { tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Wall } from "../tiles/wall"

export class WallTool extends Tool {
  readonly type = tileTypes.WALL
  protected readonly symbol = new Wall({ x: 0, y: 0 })

  execute = (pos: Point, _variant: number, existingTile: MaybeTile) => {
    if (!existingTile) return new Wall(pos)
    return
  }
}
