import { Tool } from "./tool"
import { GridObject } from "../grid-object"
import { Point } from "../lib/point"

export abstract class TileTool<T extends GridObject> extends Tool {
  protected abstract readonly symbol?: T

  protected sameType = (tile: GridObject): tile is T => tile.type === this.type

  abstract execute(pos: Point, variant: number, existingTile: GridObject | undefined): T | undefined
}
