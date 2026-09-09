import { EditCommand } from "./edit-command"
import { cloneButton } from "./templates"
import { GridObject } from "../../grid-object"
import { NEXT_DIRECTION, PREVIOUS_DIRECTION } from "../../lib/constants"

export interface Rotatable {
  direction: string
}

export class RotationControl extends EditCommand {
  readonly el: HTMLElement

  constructor(tile: GridObject) {
    super(tile)
    this.el = document.createElement("div")
    this.el.className = "rotation-control"

    const ccwButton = this.makeButton("↺", PREVIOUS_DIRECTION)
    const cwButton = this.makeButton("↻", NEXT_DIRECTION)
    this.el.append(ccwButton, cwButton)
  }

  private makeButton = (
    label: string,
    directionTransformLookup: Record<string, string>,
  ): HTMLButtonElement => {
    const button = cloneButton()
    button.querySelector<HTMLElement>(".edit-panel-button-label")!.textContent = label
    button.addEventListener("click", () => this.rotate(directionTransformLookup))
    return button
  }

  private rotate = (directionTransformLookup: Record<string, string>) => {
    const tile = this.tile as GridObject & Rotatable
    tile.direction = directionTransformLookup[tile.direction]
  }
}
