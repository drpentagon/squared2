import { RotatingTileTool } from "./rotating-tile-tool"
import { EditCommandConstructor, EditPanelCommand } from "./tile-edit-panel"
import { Ball } from "../ball"
import { TOOL, directions, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"

export class BallTool extends RotatingTileTool<Ball> {
  readonly type = tileTypes.BALL
  protected offset = TOOL.SIZE / 2
  protected speed = 200
  protected readonly symbol = new Ball({ x: 0, y: 0 }, this.speed, directions.RIGHT)

  protected createTile = (pos: Point) => new Ball(pos, this.speed, directions.RIGHT)

  editPanelCommands(): EditCommandConstructor[] {
    return [...super.editPanelCommands(), EditPanelCommand.SPEED_BUTTON]
  }
}
