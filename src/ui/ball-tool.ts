import { RotatingTileTool } from "./rotating-tile-tool"
import { Ball } from "../ball"
import { TOOL, tileTypes } from "../lib/constants"
import { DIRECTION_STEPS } from "../lib/geometry"
import { Point } from "../lib/point"

const UNIT_VELOCITY_BY_DIRECTION: Record<string, [number, number]> = {
  [DIRECTION_STEPS[0]]: [0, -1],
  [DIRECTION_STEPS[1]]: [1, 0],
  [DIRECTION_STEPS[2]]: [0, 1],
  [DIRECTION_STEPS[3]]: [-1, 0],
}

const velocityByDirection = (direction: string, speed: number): [number, number] => {
  const [dx, dy] = UNIT_VELOCITY_BY_DIRECTION[direction]
  return [dx * speed, dy * speed]
}

export class BallTool extends RotatingTileTool<Ball> {
  readonly type = tileTypes.BALL
  protected offset = TOOL.SIZE / 2
  protected speed = 200
  protected readonly symbol = new Ball({ x: 0, y: 0 }, this.speed, 0)

  protected createTile = (pos: Point) => new Ball(pos, this.speed, 0)

  variantIndex = (tile: Ball) => DIRECTION_STEPS.indexOf(tile.direction())

  setVariant = (tile: Ball, variant: number) => {
    ;[tile.vx, tile.vy] = velocityByDirection(DIRECTION_STEPS[variant], this.speed)
  }
}
