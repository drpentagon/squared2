import { Canvas } from "../../canvas"
import { DELETE_BUTTON } from "../../lib/constants"
import { DELETE_BUTTON_STYLE } from "../../lib/styles"
import { writeMini } from "../../lib/text"
import { Point } from "../../lib/point"

export class DeleteButton {
  onClick: () => void = () => {}

  draw = (canvas: Canvas, pos: Point) => {
    canvas.drawRect(pos, DELETE_BUTTON.WIDTH, DELETE_BUTTON.HEIGHT, DELETE_BUTTON_STYLE)
    writeMini(canvas, "REMOVE", 7, 1, pos)
  }

  contains = (pos: Point, point: Point): boolean =>
    point.x >= pos.x &&
    point.x < pos.x + DELETE_BUTTON.WIDTH &&
    point.y >= pos.y &&
    point.y < pos.y + DELETE_BUTTON.HEIGHT
}
