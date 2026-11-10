import { Divider } from "./divider"
import { EditCommand } from "./edit-command"
import { GridObject } from "../../grid-object"

export class DividerCommand extends EditCommand {
  readonly el: HTMLElement

  constructor(tile: GridObject) {
    super(tile)
    this.el = new Divider().el
  }
}
