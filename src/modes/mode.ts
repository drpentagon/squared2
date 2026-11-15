import { StateName } from "../game-state"
import { Point } from "../lib/point"

export type Navigate = (state: StateName) => Promise<void>

export interface Mode {
  enter(): void | Promise<void>
  update(dt: number): void | Promise<void>
  render(): void
  handleClick(tilePos: Point, variant: number): void
}
