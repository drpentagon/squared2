import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { GRID_SIZE } from "../constants"
import { gridOrigin } from "../grid"
import { GraphicsLayer } from "./graphics-layer"

export class DynamicGraphics extends GraphicsLayer {
  protected canvas: Canvas
  private ball: Ball
  private ball2: Ball

  constructor() {
    super()
    this.canvas = new Canvas(2)
    this.canvas.setClip(gridOrigin.x, gridOrigin.y, GRID_SIZE, GRID_SIZE)

    this.ball = new Ball(6, 3, 0, 200)
    this.ball2 = new Ball(6, 5, 200, 0)
  }

  update = (_dt: number) => {
    this.ball.update(_dt)
    this.ball2.update(_dt)
  }

  draw = () => {
    this.canvas.clear()
    this.ball.draw(this.canvas)
    this.ball2.draw(this.canvas)
  }
}
