import { EditCommand } from "./edit-command"
import { RangeController } from "./range-controller"
import { Ball } from "../../ball"
import { GridObject } from "../../grid-object"

const DOT_COUNT = 7
const BASE_SPEED = 100
const SPEED_STEP = 50
const MAX_SPEED = BASE_SPEED + (DOT_COUNT - 1) * SPEED_STEP

const speedForLitCount = (litCount: number): number => BASE_SPEED + (litCount - 1) * SPEED_STEP

const clampLitCount = (litCount: number): number => Math.max(1, Math.min(DOT_COUNT, litCount))

const litCountForSpeed = (speed: number): number =>
  clampLitCount(Math.round((speed - BASE_SPEED) / SPEED_STEP) + 1)

export class SpeedButton extends EditCommand {
  readonly el: HTMLElement
  private ball: Ball
  private litCount: number
  private rangeController: RangeController

  constructor(tile: GridObject) {
    super(tile)
    this.ball = tile as Ball
    this.litCount = litCountForSpeed(this.ball.velocity)

    this.rangeController = new RangeController(
      "SPEED",
      () => this.setLitCount(this.litCount - 1),
      () => this.setLitCount(this.litCount + 1),
      BASE_SPEED,
      MAX_SPEED,
      DOT_COUNT,
      speedForLitCount(this.litCount),
    )
    this.el = this.rangeController.el
  }

  private setLitCount = (litCount: number) => {
    this.litCount = clampLitCount(litCount)
    const speed = speedForLitCount(this.litCount)
    this.rangeController.setValue(speed)
    this.ball.velocity = speed
  }
}
