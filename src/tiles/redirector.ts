import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { Tile } from "./tile"

export class Redirector extends Tile {
  interact = (ball: Ball) => {}

  draw = (canvas: Canvas) => {
    canvas.ctx.beginPath()
  }
}
