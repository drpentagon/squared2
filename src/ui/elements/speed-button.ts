import { EditCommand } from "./edit-command"
import { cloneDiode, cloneDivider, clonePlusMinusButton } from "./templates"
import { Ball } from "../../ball"
import { GridObject } from "../../grid-object"

const DOT_COUNT = 7
const BASE_SPEED = 100
const SPEED_STEP = 50

const speedForLitCount = (litCount: number): number => BASE_SPEED + (litCount - 1) * SPEED_STEP

const clampLitCount = (litCount: number): number => Math.max(1, Math.min(DOT_COUNT, litCount))

const litCountForSpeed = (speed: number): number =>
  clampLitCount(Math.round((speed - BASE_SPEED) / SPEED_STEP) + 1)

export class SpeedButton extends EditCommand {
  readonly el: HTMLElement
  private ball: Ball
  private dots: HTMLElement[] = []
  private litCount: number

  constructor(tile: GridObject) {
    super(tile)
    this.ball = tile as Ball
    this.litCount = litCountForSpeed(this.ball.velocity)

    this.el = document.createElement("div")
    this.el.className = "speed-button-wrapper"

    const button = clonePlusMinusButton()
    button.querySelector<HTMLElement>(".plus-minus-button-label")!.textContent = "SPEED"
    button
      .querySelector(".plus-minus-button-decrease")!
      .addEventListener("click", () => this.setLitCount(this.litCount - 1))
    button
      .querySelector(".plus-minus-button-increase")!
      .addEventListener("click", () => this.setLitCount(this.litCount + 1))

    const dots = document.createElement("div")
    dots.className = "speed-button-dots"
    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = cloneDiode()
      this.dots.push(dot)
      dots.append(dot)
    }
    this.updateDots()

    const divider = cloneDivider()

    this.el.append(button, dots, divider)
  }

  private setLitCount = (litCount: number) => {
    this.litCount = clampLitCount(litCount)
    this.updateDots()
    this.ball.velocity = speedForLitCount(this.litCount)
  }

  private updateDots = () => {
    this.dots.forEach((dot, i) => {
      dot.classList.toggle("diode-on", i < this.litCount)
    })
  }
}
