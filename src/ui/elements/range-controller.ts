import { DiodeRange } from "./diode-range"
import { Divider } from "./divider"
import { PlusMinusButton } from "./plus-minus-button"

export class RangeController {
  readonly el: HTMLElement
  private diodeRange: DiodeRange

  constructor(
    text: string,
    onDecrease: () => void,
    onIncrease: () => void,
    min: number,
    max: number,
    steps: number,
    initialValue: number,
  ) {
    this.el = document.createElement("div")
    this.el.className = "range-controller"

    const button = new PlusMinusButton(text, onDecrease, onIncrease)

    this.diodeRange = new DiodeRange(min, max, steps)
    this.diodeRange.setValue(initialValue)

    const divider = new Divider()

    this.el.append(button.el, this.diodeRange.el, divider.el)
  }

  setValue = (value: number) => {
    this.diodeRange.setValue(value)
  }
}
