import { RotatingTileTool } from "./rotating-tile-tool"
import { tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Goal } from "../tiles/goal"

const OPENING_UP = 0

export class GoalTool extends RotatingTileTool<Goal> {
  readonly type = tileTypes.GOAL
  protected readonly symbol = new Goal({ x: 0, y: 0 }, OPENING_UP, false)

  protected createTile = (pos: Point) => new Goal(pos, OPENING_UP, false)

  protected rotate = (tile: Goal) => {
    tile.direction = (tile.direction + 1) % 4
  }
}
