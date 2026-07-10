import { TOOL_SIZE, tileTypes } from "../lib/constants"
import { Canvas } from "../canvas"
import { MaybeTile, Tool } from "./tool"

const SQUARE_SIZE = TOOL_SIZE / 2
const OFFSET = (TOOL_SIZE - SQUARE_SIZE) / 2

export class DefaultTool extends Tool {
  constructor(canvas: Canvas) {
    super(canvas, tileTypes.NONE)
  }

  execute = (tileX: number, tileY: number, variant: number, existingTile: MaybeTile) => {
    return undefined
  }

  draw = (x: number, y: number) => {
    this.canvas.drawSquare(x + OFFSET, y + OFFSET, SQUARE_SIZE)
  }
}
