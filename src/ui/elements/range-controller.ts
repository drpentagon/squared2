import { DiodeRange } from "./diode-range"
import { Divider } from "./divider"
import { PlusMinusButton } from "./plus-minus-button"

export class RangeController {
  readonly el: HTMLElement
  private diodeRange: DiodeRange
  private step: number

  constructor(
    text: string,
    private min: number,
    private stepSize: number,
    private stepCount: number,
    initialValue: number,
    private onChange: (value: number) => void,
  ) {
    this.step = this.stepForValue(initialValue)

    this.el = document.createElement("div")
    this.el.className = "range-controller"

    const button = new PlusMinusButton(
      text,
      () => this.setStep(this.step - 1),
      () => this.setStep(this.step + 1),
    )

    this.diodeRange = new DiodeRange(stepCount)
    this.diodeRange.setLitCount(this.step)

    const divider = new Divider()

    this.el.append(this.diodeRange.el, button.el, divider.el)
  }

  get value(): number {
    return this.min + (this.step - 1) * this.stepSize
  }

  set value(value: number) {
    this.step = this.stepForValue(value)
    this.diodeRange.setLitCount(this.step)
  }

  private setStep = (step: number) => {
    this.step = this.clampStep(step)
    this.diodeRange.setLitCount(this.step)
    this.onChange(this.value)
  }

  private stepForValue = (value: number): number =>
    this.clampStep(Math.round((value - this.min) / this.stepSize) + 1)

  private clampStep = (step: number): number => Math.max(1, Math.min(this.stepCount, step))
}
