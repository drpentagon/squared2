import { RotatingTileTool } from "./rotating-tile-tool"
import { Ball } from "../ball"
import { DIRECTIONS, TOOL, directions, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"

export class BallTool extends RotatingTileTool<Ball> {
  readonly type = tileTypes.BALL
  protected offset = TOOL.SIZE / 2
  protected speed = 200
  protected readonly symbol = new Ball({ x: 0, y: 0 }, this.speed, directions.RIGHT)

  protected createTile = (pos: Point) => new Ball(pos, this.speed, directions.RIGHT)

  variantIndex = (tile: Ball) => DIRECTIONS.indexOf(tile.direction)

  setVariant = (tile: Ball, variant: number) => {
    tile.direction = DIRECTIONS[variant]
  }
}
