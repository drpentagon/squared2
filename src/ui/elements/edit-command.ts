import { GridObject } from "../../grid-object"

export abstract class EditCommand {
  abstract readonly el: HTMLElement

  constructor(protected tile: GridObject) {}
}
