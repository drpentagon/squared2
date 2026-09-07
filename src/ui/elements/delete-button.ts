import { EditCommand } from "./edit-command"
import { GridObject } from "../../grid-object"

export class DeleteButton extends EditCommand {
  readonly el: HTMLButtonElement

  constructor(tile: GridObject) {
    super(tile)
    this.el = document.createElement("button")
    this.el.className = "edit-panel-button delete-button"

    const label = document.createElement("p")
    label.className = "edit-panel-button-label"
    label.textContent = "REMOVE"
    this.el.append(label)

    this.el.addEventListener("click", () => {
      this.tile.consumed = true
    })
  }
}
