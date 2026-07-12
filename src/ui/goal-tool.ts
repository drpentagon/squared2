import { tileTypes } from "../lib/constants"
import { Goal } from "../tiles/goal"
import { RotatingTileTool } from "./rotating-tile-tool"

const OPENING_UP = 0

export class GoalTool extends RotatingTileTool<Goal> {
  readonly type = tileTypes.GOAL
  protected readonly symbol = new Goal(0, 0, OPENING_UP, false)

  protected createTile = (tileX: number, tileY: number) => new Goal(tileX, tileY, OPENING_UP, false)

  protected rotate = (tile: Goal) => {
    tile.direction = (tile.direction + 1) % 4
  }
}
