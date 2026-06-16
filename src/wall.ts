import { Canvas } from "./canvas"
import { DOT_CC, DOT_SIZE, DOT_SPACING, TILE_CC } from "./constants"
import { gridOrigin } from "./grid"
import { Style } from "./style"

const SQUARE_SIZE = 2 * DOT_SIZE + DOT_SPACING
const SQUARE_STEP = 2 * DOT_CC

const wallStyle = new Style("transparent", "rgba(255, 255, 255, 0.7)", 2)

export class Wall {
  x: number
  y: number

  constructor(tileX: number, tileY: number) {
    this.x = (1 + tileX * TILE_CC) * DOT_CC
    this.y = (1 + tileY * TILE_CC) * DOT_CC
  }

  draw = (canvas: Canvas) => {
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        console.log(gridOrigin.x + this.x + sx * SQUARE_STEP)
        canvas.drawSquare(
          gridOrigin.x + this.x + sx * SQUARE_STEP,
          gridOrigin.y + this.y + sy * SQUARE_STEP,
          SQUARE_SIZE,
          wallStyle,
        )
      }
    }
  }
}
