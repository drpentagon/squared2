import { RotatingTileTool } from "./rotating-tile-tool"
import { EditCommandConstructor, EditPanelCommand } from "./tile-edit-panel"
import { directions, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Goal } from "../tiles/goal"

export class GoalTool extends RotatingTileTool<Goal> {
  readonly type = tileTypes.GOAL
  protected readonly symbol = new Goal({ x: 0, y: 0 }, directions.UP, false)

  protected createTile = (pos: Point) => new Goal(pos, directions.UP, false)

  editPanelCommands(): EditCommandConstructor[] {
    return [
      EditPanelCommand.DELETE_BUTTON,
      EditPanelCommand.DIVIDER,
      EditPanelCommand.ROTATES_TOGGLE,
      EditPanelCommand.ROTATION_CONTROL,
    ]
  }
}
