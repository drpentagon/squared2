import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { SQUARE_SIZE, SQUARE_STEP } from "../constants"
import { gridOrigin } from "../grid"
import { playBounce } from "../sound"
import { Tile } from "./tile"

const WALL_SIZE = 2 * SQUARE_STEP + SQUARE_SIZE

export class Wall extends Tile {
  interact = (ball: Ball) => {
    const overlapX = Math.min(ball.x + ball.size, this.x + WALL_SIZE) - Math.max(ball.x, this.x)
    const overlapY = Math.min(ball.y + ball.size, this.y + WALL_SIZE) - Math.max(ball.y, this.y)

    ball.x -= Math.sign(ball.vx) * overlapX
    ball.y -= Math.sign(ball.vy) * overlapY

    ball.vx = -ball.vx
    ball.vy = -ball.vy

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
