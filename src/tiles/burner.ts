import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import { DOT, SQUARE, TILE, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { Style } from "../lib/style"
import { BURNER } from "../lib/styles"

const INSET = (TILE.SIZE - SQUARE.SIZE) / 2

const PULSE_MS = 2000
const MIN_ALPHA = 0.6

export class Burner extends Tile {
  readonly type = tileTypes.BURNER

  interact = (ball: Ball) => {
    if (this.overlap(ball) < INSET) return

    ball.lost = true
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawSquare({ x: pos.x + INSET, y: pos.y + INSET }, SQUARE.SIZE, pulsed())
  }

  renderMiniature = (canvas: Canvas, pos: Point) => {
    canvas.drawSquare(pos, DOT.SIZE, BURNER)
  }
}

const pulsed = () => new Style(`rgba(255, 255, 255, ${alphaAt(performance.now())})`)

const alphaAt = (ms: number) => {
  const wave = (1 - Math.cos((ms / PULSE_MS) * 2 * Math.PI)) / 2

  return 1 - wave * (1 - MIN_ALPHA)
}
