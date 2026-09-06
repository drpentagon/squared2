import { RotatingTileTool } from "./rotating-tile-tool"
import { directions, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Goal } from "../tiles/goal"

export class GoalTool extends RotatingTileTool<Goal> {
  readonly type = tileTypes.GOAL
  protected readonly symbol = new Goal({ x: 0, y: 0 }, directions.UP, false)

  protected createTile = (pos: Point) => new Goal(pos, directions.UP, false)
}
