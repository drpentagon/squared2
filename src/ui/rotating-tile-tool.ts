import { Rotatable } from "./elements/rotation-control"
import { TileTool } from "./tile-tool"
import { EditCommandConstructor, EditPanelCommand } from "./tile-edit-panel"
import { GridObject } from "../grid-object"
import { NEXT_DIRECTION } from "../lib/constants"
import { equals, Point } from "../lib/point"

export abstract class RotatingTileTool<T extends GridObject & Rotatable> extends TileTool<T> {
  private clickPos: Point | null = null
  private clickCount = 0

  protected abstract createTile(pos: Point, variant: number): T

  editPanelCommands(): EditCommandConstructor[] {
    return [...super.editPanelCommands(), EditPanelCommand.ROTATION_CONTROL]
  }

  private rotate = (tile: T) => {
    tile.direction = NEXT_DIRECTION[tile.direction]
  }

  execute = (pos: Point, variant: number, existingTile: GridObject | undefined) => {
    if (!this.clickPos || !equals(this.clickPos, pos)) {
      this.clickPos = pos
      this.clickCount = 0
    }
    this.clickCount++

    if (!existingTile) return this.createTile(pos, variant)

    if (this.sameType(existingTile)) {
      if (this.clickCount > 4) {
        this.clickCount = 0
        return
      }
      this.rotate(existingTile)
      return existingTile
    }

    return
  }
}
