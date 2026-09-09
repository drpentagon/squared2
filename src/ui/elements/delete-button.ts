import { EditCommand } from "./edit-command"
import { cloneButton } from "./templates"
import { GridObject } from "../../grid-object"

export class DeleteButton extends EditCommand {
  readonly el: HTMLButtonElement

  constructor(tile: GridObject) {
    super(tile)
    this.el = cloneButton()
    this.el.classList.add("delete-button")
    this.el.querySelector<HTMLElement>(".edit-panel-button-label")!.textContent = "REMOVE"

    this.el.addEventListener("click", () => {
      this.tile.consumed = true
    })
  }
}
