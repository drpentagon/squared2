import { Level } from "./level"
import { Point } from "./lib/point"

export interface Mode {
  setLevel(level: Level): void
  update(dt: number): void
  handleClick(tilePos: Point, variant: number): void
}
