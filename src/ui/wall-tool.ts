import { TILE_SIZE, TOOL_SIZE, tileTypes } from "../lib/constants"
import { Canvas } from "../canvas"
import { Wall } from "../tiles/wall"
import { MaybeTile, Tool } from "./tool"

const OFFSET = (TOOL_SIZE - TILE_SIZE) / 2

export class WallTool extends Tool {
  private wall = new Wall(0, 0)

  constructor(canvas: Canvas) {
    super(canvas, tileTypes.WALL)
  }

  execute = (tileX: number, tileY: number, _variant: number, existingTile: MaybeTile) => {
    if (!existingTile) return new Wall(tileX, tileY)
    return
  }

  draw = (x: number, y: number) => {
    this.wall.draw(this.canvas, x + OFFSET, y + OFFSET)
  }
}
