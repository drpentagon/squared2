import { EditCommand } from "./edit-command"
import { ToggleButton } from "./toggle-button"
import { GridObject } from "../../grid-object"
import { Goal } from "../../tiles/goal"

export class RotatesToggle extends EditCommand {
  readonly el: HTMLElement

  constructor(tile: GridObject) {
    super(tile)
    const goal = tile as Goal

    this.el = new ToggleButton("Rotates", goal.rotates, (active) => {
      goal.rotates = active
    }).el
  }
}
