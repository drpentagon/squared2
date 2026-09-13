import { Diode } from "./diode"

const DIODE_COUNT = 5
const STEP_MS = 200
const HOLD_MS = 1000

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export class SaveIndicator {
  readonly el: HTMLElement
  private diodes: Diode[]
  private playing = false

  constructor() {
    this.el = document.createElement("div")
    this.el.className = "diode-range"
    this.diodes = Array.from({ length: DIODE_COUNT }, () => new Diode())
    this.diodes.forEach((diode) => this.el.append(diode.el))
  }

  play = async () => {
    if (this.playing) return
    this.playing = true

    for (let i = 0; i < this.diodes.length; i++) {
      this.diodes[i].setOn(true)
      if (i < this.diodes.length - 1) await wait(STEP_MS)
    }
    await wait(HOLD_MS)
    this.diodes.forEach((diode) => diode.setOn(false))

    this.playing = false
  }
}
