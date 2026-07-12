import { Canvas } from "../canvas"
import { TILE_SIZE, TOOL_DOTS, TOOL_SIZE } from "../lib/constants"
import { TOOL_SELECTED } from "../lib/styles"
import { Tile } from "../tiles/tile"

export type MaybeTile = Tile | undefined

export abstract class Tool {
  abstract readonly type: string
  protected abstract readonly symbol: Tile
  protected offset = (TOOL_SIZE - TILE_SIZE) / 2
  selected = false

  constructor(protected canvas: Canvas) {}

  abstract execute(
    tileX: number,
    tileY: number,
    variant: number,
    existingTile: MaybeTile,
  ): MaybeTile

  render = (x: number, y: number) => {
    if (this.selected) this.drawSelection(x, y)
    this.symbol.draw(this.canvas, x + this.offset, y + this.offset)
  }

  private drawSelection = (x: number, y: number) => {
    this.canvas.fillDots(x, y, TOOL_DOTS, TOOL_DOTS, TOOL_SELECTED)
  }
}
