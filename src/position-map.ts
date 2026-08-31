import { GridObject } from "./grid-object"
import { Point } from "./lib/point"

export class PositionMap<T extends GridObject> {
  private items = new Map<number, Map<number, T>>()

  set = (item: T) => {
    if (!this.items.has(item.tilePos.x)) this.items.set(item.tilePos.x, new Map())
    this.items.get(item.tilePos.x)!.set(item.tilePos.y, item)
  }

  addArray = (items: T[]) => {
    items.forEach(this.set)
  }

  get = (pos: Point) => this.items.get(pos.x)?.get(pos.y)

  delete = (pos: Point) => {
    this.items.get(pos.x)?.delete(pos.y)
  }

  clear = () => {
    this.items.clear()
  }

  forEach = (callback: (item: T) => void) => {
    this.items.forEach((column) => column.forEach(callback))
  }
}
