import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import { SQUARE_SIZE, SQUARE_STEP, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { playBounce } from "../lib/sound"
import { ROCK } from "../lib/styles"

export class Wall extends Tile {
  readonly type = tileTypes.WALL
  private readonly style = ROCK

  interact = (ball: Ball) => {
    ball.perpendicularBounce(this.overlap(ball))
    playBounce()
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        canvas.drawSquare(
          { x: pos.x + sx * SQUARE_STEP, y: pos.y + sy * SQUARE_STEP },
          SQUARE_SIZE,
          this.style,
        )
      }
    }
  }
}
