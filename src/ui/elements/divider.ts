import { cloneDivider } from "./templates"

export class Divider {
  readonly el: HTMLElement

  constructor() {
    this.el = cloneDivider()
  }
}
