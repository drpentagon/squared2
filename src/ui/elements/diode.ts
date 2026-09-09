import { cloneDiode } from "./templates"

export class Diode {
  readonly el: HTMLElement

  constructor() {
    this.el = cloneDiode()
  }

  setOn = (on: boolean) => {
    this.el.classList.toggle("diode-on", on)
  }
}
