import { Canvas } from "./canvas"
import { Point } from "./lib/point"

export abstract class GridObject {
  consumed = false

  constructor(
    public tilePos: Point,
    public pos: Point,
  ) {}

  abstract readonly type: string
  abstract draw(canvas: Canvas, pos?: Point, editing?: boolean): void
}
