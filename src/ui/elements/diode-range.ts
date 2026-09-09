import { Diode } from "./diode"

export class DiodeRange {
  readonly el: HTMLElement
  private diodes: Diode[] = []

  constructor(
    private min: number,
    private max: number,
    private steps: number,
  ) {
    this.el = document.createElement("div")
    this.el.className = "diode-range"

    for (let i = 0; i < steps; i++) {
      const diode = new Diode()
      this.diodes.push(diode)
      this.el.append(diode.el)
    }
  }

  setValue = (value: number) => {
    const litCount = this.litCountForValue(value)
    this.diodes.forEach((diode, i) => diode.setOn(i < litCount))
  }

  private litCountForValue = (value: number): number => {
    const stepSize = (this.max - this.min) / (this.steps - 1)
    const index = Math.round((value - this.min) / stepSize)
    return Math.max(1, Math.min(this.steps, index + 1))
  }
}
