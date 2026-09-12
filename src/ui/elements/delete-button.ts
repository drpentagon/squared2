import { Button } from "./button"
import { EditCommand } from "./edit-command"
import { GridObject } from "../../grid-object"

export class DeleteButton extends EditCommand {
  readonly el: HTMLButtonElement

  constructor(tile: GridObject) {
    super(tile)
    const button = new Button(
      "REMOVE",
      () => {
        this.tile.consumed = true
      },
      "button--delete",
    )
    this.el = button.el
  }
}
