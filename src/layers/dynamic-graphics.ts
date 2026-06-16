import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { GRID_SIZE } from "../constants"
import { gridOrigin } from "../grid"
import { GraphicsLayer } from "./graphics-layer"

export class DynamicGraphics extends GraphicsLayer {
  protected canvas: Canvas
  private balls: Ball[]

  constructor(balls: Ball[]) {
    super()
    this.canvas = new Canvas(2)
    this.canvas.setClip(gridOrigin.x, gridOrigin.y, GRID_SIZE, GRID_SIZE)

    this.balls = balls
  }

  update = (_dt: number) => {
    this.balls.forEach((ball) => ball.update(_dt))
  }

  draw = () => {
    this.canvas.clear()
    this.balls.forEach((ball) => ball.draw(this.canvas))
  }
}
