export class DeleteButton {
  readonly el: HTMLButtonElement

  onClick: () => void = () => {}

  constructor() {
    this.el = document.createElement("button")
    this.el.className = "edit-panel-button delete-button"
    this.el.textContent = "Ta bort"
    this.el.addEventListener("click", () => this.onClick())
  }
}
