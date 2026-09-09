import { Button } from "./button"
import { EditCommand } from "./edit-command"
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

    const ccwButton = new Button("↺", () => this.rotate(PREVIOUS_DIRECTION))
    const cwButton = new Button("↻", () => this.rotate(NEXT_DIRECTION))
    this.el.append(ccwButton.el, cwButton.el)
  }

  private rotate = (directionTransformLookup: Record<string, string>) => {
    const tile = this.tile as GridObject & Rotatable
    tile.direction = directionTransformLookup[tile.direction]
  }
}
