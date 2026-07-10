import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { SQUARE_SIZE, SQUARE_STEP, tileTypes } from "../lib/constants"
import { Style } from "../lib/style"
import { ROCK } from "../lib/styles"
import { gridOrigin } from "../grid"
import { playBounce } from "../lib/sound"
import { Tile } from "./tile"

export class Wall extends Tile {
  constructor(
    tileX: number,
    tileY: number,
    private style: Style = ROCK,
  ) {
    super(tileX, tileY)
  }

  get type() {
    return tileTypes.WALL
  }

  interact = (ball: Ball) => {
    ball.perpendicularBounce(this.overlap(ball))
    playBounce()
  }

  draw = (canvas: Canvas, x = gridOrigin.x + this.x, y = gridOrigin.y + this.y) => {
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        canvas.drawSquare(x + sx * SQUARE_STEP, y + sy * SQUARE_STEP, SQUARE_SIZE, this.style)
      }
    }
  }
}
