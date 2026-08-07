import { MaybeTile, Tool } from "./tool"
import { SQUARE_SIZE, SQUARE_STEP, TOOL_SIZE } from "../lib/constants"
import { Point } from "../lib/point"
import { CLEAR, TOOL_SELECTED } from "../lib/styles"

export class ClearLevelTool extends Tool {
  readonly type = "CLEAR_LEVEL"
  protected readonly symbol = undefined

  onClear: () => void = () => {}

  execute = (_pos: Point, _variant: number, _existingTile: MaybeTile) => {
    this.onClear()
    return undefined
  }

  render = (pos: Point) => {
    if (this.selected) this.canvas.drawSquare(pos, TOOL_SIZE, TOOL_SELECTED)
    const origin = { x: pos.x + this.offset, y: pos.y + this.offset }
    for (let i = 0; i < 3; i++) {
      this.canvas.drawSquare(
        { x: origin.x + i * SQUARE_STEP, y: origin.y + i * SQUARE_STEP },
        SQUARE_SIZE,
        CLEAR,
      )
      this.canvas.drawSquare(
        { x: origin.x + (2 - i) * SQUARE_STEP, y: origin.y + i * SQUARE_STEP },
        SQUARE_SIZE,
        CLEAR,
      )
    }
  }
}
