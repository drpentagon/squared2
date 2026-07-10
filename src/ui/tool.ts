import { Canvas } from "../canvas"
import { TOOL_DOTS } from "../lib/constants"
import { TOOL_SELECTED } from "../lib/styles"
import { Tile } from "../tiles/tile"

export type MaybeTile = Tile | undefined

export abstract class Tool {
  selected = false

  constructor(
    protected canvas: Canvas,
    private toolType: string,
  ) {}

  get type() {
    return this.toolType
  }

  abstract execute(
    tileX: number,
    tileY: number,
    variant: number,
    existingTile: MaybeTile,
  ): MaybeTile

  abstract draw(x: number, y: number): void

  render = (x: number, y: number) => {
    if (this.selected) this.drawSelection(x, y)
    this.draw(x, y)
  }

  private drawSelection = (x: number, y: number) => {
    this.canvas.fillDots(x, y, TOOL_DOTS, TOOL_DOTS, TOOL_SELECTED)
  }
}
