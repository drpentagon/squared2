import { cloneButton } from "./templates"

export class Button {
  readonly el: HTMLButtonElement

  constructor(text: string, onClick: () => void, modifier?: string) {
    this.el = cloneButton()
    if (modifier) this.el.classList.add(modifier)
    this.el.querySelector<HTMLElement>(".edit-panel-button-label")!.textContent = text
    this.el.addEventListener("click", onClick)
  }
}
