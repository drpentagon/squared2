import { EditCommandConstructor, EditPanelCommand } from "./tile-edit-panel"
import { Canvas } from "../canvas"
import { GridObject } from "../grid-object"
import { TILE, TOOL } from "../lib/constants"
import { Point } from "../lib/point"
import { TOOL_SELECTED } from "../lib/styles"

export abstract class TileTool<T extends GridObject> {
  abstract readonly type: string
  protected abstract readonly symbol: T
  protected offset = (TOOL.SIZE - TILE.SIZE) / 2
  selected = false

  constructor(protected canvas: Canvas) {}

  protected sameType = (tile: GridObject): tile is T => tile.type === this.type

  abstract execute(pos: Point, variant: number, existingTile: GridObject | undefined): T | undefined

  editPanelCommands(): EditCommandConstructor[] {
    return [EditPanelCommand.DELETE_BUTTON]
  }

  render = (pos: Point) => {
    if (this.selected) this.canvas.drawSquare(pos, TOOL.SIZE, TOOL_SELECTED)
    this.symbol.draw(this.canvas, { x: pos.x + this.offset, y: pos.y + this.offset })
  }
}
