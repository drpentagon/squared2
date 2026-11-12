import { Icon } from "./icon"
import { clonePlusMinusButton } from "./templates"

export class PlusMinusButton {
  readonly el: HTMLElement

  constructor(text: string, onDecrease: () => void, onIncrease: () => void) {
    this.el = clonePlusMinusButton()
    this.el.querySelector<HTMLElement>(".plus-minus-button-label")!.textContent = text
    this.el.querySelector(".plus-minus-symbol--decrease")!.append(new Icon("minus").el)
    this.el.querySelector(".plus-minus-symbol--increase")!.append(new Icon("plus").el)
    this.el.querySelector(".plus-minus-button-decrease")!.addEventListener("click", onDecrease)
    this.el.querySelector(".plus-minus-button-increase")!.addEventListener("click", onIncrease)
  }
}
