import { EditCommand } from "./edit-command"
import { RangeController } from "./range-controller"
import { Ball } from "../../ball"
import { GridObject } from "../../grid-object"

const STEP_COUNT = 7
const MIN_SPEED = 100
const SPEED_STEP = 50

export class SpeedButton extends EditCommand {
  readonly el: HTMLElement

  constructor(tile: GridObject) {
    super(tile)
    const ball = tile as Ball

    this.el = new RangeController(
      "SPEED",
      MIN_SPEED,
      SPEED_STEP,
      STEP_COUNT,
      ball.velocity,
      (speed) => {
        ball.velocity = speed
      },
    ).el
  }
}
