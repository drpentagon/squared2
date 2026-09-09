import { EditCommand } from "./edit-command"
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

    const dots = document.createElement("div")
    dots.className = "speed-button-dots"
    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement("span")
      dot.className = "speed-button-dot"
      this.dots.push(dot)
      dots.append(dot)
    }
    this.updateDots()

    const button = document.createElement("div")
    button.className = "speed-button"

    const decreaseButton = document.createElement("button")
    decreaseButton.className = "speed-button-left"
    const decreaseSymbol = document.createElement("p")
    decreaseSymbol.className = "speed-button-symbol speed-button-decrease"
    decreaseSymbol.textContent = "-"
    decreaseButton.append(decreaseSymbol)
    decreaseButton.addEventListener("click", () => this.setLitCount(this.litCount - 1))

    const label = document.createElement("p")
    label.className = "speed-button-text"
    label.textContent = "SPEED"

    const increaseButton = document.createElement("button")
    increaseButton.className = "speed-button-right"
    const increaseSymbol = document.createElement("p")
    increaseSymbol.className = "speed-button-symbol speed-button-increase"
    increaseSymbol.textContent = "+"
    increaseButton.append(increaseSymbol)
    increaseButton.addEventListener("click", () => this.setLitCount(this.litCount + 1))

    const divider = document.createElement("div")
    divider.className = "speed-button-divider"
    const dividerTop = document.createElement("div")
    dividerTop.className = "speed-button-divider-top"
    const dividerBottom = document.createElement("div")
    dividerBottom.className = "speed-button-divider-bottom"
    divider.append(dividerTop, dividerBottom)

    button.append(decreaseButton, label, increaseButton)
    this.el.append(button, dots, divider)
  }

  private setLitCount = (litCount: number) => {
    this.litCount = clampLitCount(litCount)
    this.updateDots()
    this.ball.velocity = speedForLitCount(this.litCount)
  }

  private updateDots = () => {
    this.dots.forEach((dot, i) => {
      dot.classList.toggle("speed-button-dot-on", i < this.litCount)
    })
  }
}
