import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { SQUARE_SIZE, SQUARE_STEP } from "../constants"
import { gridOrigin } from "../grid"
import { playBounce } from "../sound"
import { Tile } from "./tile"

export class Wall extends Tile {
  interact = (ball: Ball) => {
    if (!ball.isNewEntry) return
    ball.perpendicularBounce(this.overlap(ball))
    playBounce()
  }

  draw = (canvas: Canvas) => {
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        canvas.drawSquare(
          gridOrigin.x + this.x + sx * SQUARE_STEP,
          gridOrigin.y + this.y + sy * SQUARE_STEP,
          SQUARE_SIZE,
          this.style,
        )
      }
    }
  }
}
