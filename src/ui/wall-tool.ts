import { tileTypes } from "../lib/constants"
import { Wall } from "../tiles/wall"
import { MaybeTile, Tool } from "./tool"

export class WallTool extends Tool {
  readonly type = tileTypes.WALL
  protected readonly symbol = new Wall(0, 0)

  execute = (tileX: number, tileY: number, _variant: number, existingTile: MaybeTile) => {
    if (!existingTile) return new Wall(tileX, tileY)
    return
  }
}
