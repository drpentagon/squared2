import { EditCommand } from "./edit-command"
import { GridObject } from "../../grid-object"

export class DeleteButton extends EditCommand {
  readonly el: HTMLButtonElement

  constructor(tile: GridObject) {
    super(tile)
    this.el = document.createElement("button")
    this.el.className = "edit-panel-button delete-button"
    this.el.textContent = "Ta bort"
    this.el.addEventListener("click", () => {
      this.tile.consumed = true
    })
  }
}
