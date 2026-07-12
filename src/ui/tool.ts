import { Canvas } from "../canvas"
import { TILE_SIZE, TOOL_SIZE } from "../lib/constants"
import { Point } from "../lib/point"
import { TOOL_SELECTED } from "../lib/styles"
import { Tile } from "../tiles/tile"

export type MaybeTile = Tile | undefined

export abstract class Tool {
  abstract readonly type: string
  protected abstract readonly symbol: Tile
  protected offset = (TOOL_SIZE - TILE_SIZE) / 2
  selected = false

  constructor(protected canvas: Canvas) {}

  abstract execute(pos: Point, variant: number, existingTile: MaybeTile): MaybeTile

  render = (pos: Point) => {
    if (this.selected) this.canvas.drawSquare(pos, TOOL_SIZE, TOOL_SELECTED)
    this.symbol.draw(this.canvas, { x: pos.x + this.offset, y: pos.y + this.offset })
  }
}
