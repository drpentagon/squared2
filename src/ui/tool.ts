import type { Ball } from "../ball"
import { Canvas } from "../canvas"
import { DeleteButton } from "./elements/delete-button"
import { EditPanelCommand } from "./tile-edit-panel"
import { TILE, TOOL } from "../lib/constants"
import { Point } from "../lib/point"
import { TOOL_SELECTED } from "../lib/styles"
import { Tile } from "../tiles/tile"

export type AnyTile = Tile | Ball
export type MaybeTile = AnyTile | undefined

export abstract class Tool {
  abstract readonly type: string
  protected abstract readonly symbol?: AnyTile
  protected offset = (TOOL.SIZE - TILE.SIZE) / 2
  selected = false
  readonly deleteButton = new DeleteButton()

  constructor(protected canvas: Canvas) {}

  abstract execute(pos: Point, variant: number, existingTile: MaybeTile): MaybeTile

  editPanelCommands(): EditPanelCommand[] {
    return [EditPanelCommand.DELETE_BUTTON]
  }

  render = (pos: Point) => {
    if (this.selected) this.canvas.drawSquare(pos, TOOL.SIZE, TOOL_SELECTED)
    this.symbol?.draw(this.canvas, { x: pos.x + this.offset, y: pos.y + this.offset })
  }
}
