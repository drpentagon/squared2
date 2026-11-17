import { Tile } from "./tile"
import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { origin } from "../grid"
import { DOT, SQUARE, TILE, tileTypes } from "../lib/constants"
import { Point } from "../lib/point"
import { BURNER } from "../lib/styles"

const INSET = (TILE.SIZE - SQUARE.SIZE) / 2

export class Burner extends Tile {
  readonly type = tileTypes.BURNER

  interact = (ball: Ball) => {
    if (this.overlap(ball) < INSET) return

    ball.lost = true
  }

  draw = (canvas: Canvas, pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y }) => {
    canvas.drawSquare({ x: pos.x + INSET, y: pos.y + INSET }, SQUARE.SIZE, BURNER)
  }

  renderMiniature = (canvas: Canvas, pos: Point) => {
    canvas.drawSquare(pos, DOT.SIZE, BURNER)
  }
}
