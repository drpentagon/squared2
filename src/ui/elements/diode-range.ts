import { Diode } from "./diode"

export class DiodeRange {
  readonly el: HTMLElement
  private diodes: Diode[] = []

  constructor(count: number) {
    this.el = document.createElement("div")
    this.el.className = "diode-range"

    for (let i = 0; i < count; i++) {
      const diode = new Diode()
      this.diodes.push(diode)
      this.el.append(diode.el)
    }
  }

  setLitCount = (litCount: number) => {
    this.diodes.forEach((diode, i) => diode.setOn(i < litCount))
  }
}
