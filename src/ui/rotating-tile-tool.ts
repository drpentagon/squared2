import { RotationControl } from "./elements/rotation-control"
import { EditPanelCommand } from "./tile-edit-panel"
import { AnyTile, MaybeTile, Tool } from "./tool"
import { Point } from "../lib/point"

export abstract class RotatingTileTool<T extends AnyTile> extends Tool {
  private clickPos: Point | null = null
  private clickCount = 0
  readonly rotationControl = new RotationControl<T>(this)

  protected abstract createTile(pos: Point, variant: number): T
  abstract variantIndex(tile: T): number
  abstract setVariant(tile: T, variant: number): void

  editPanelCommands(): EditPanelCommand[] {
    return [...super.editPanelCommands(), EditPanelCommand.ROTATION_CONTROL]
  }

  protected matches = (tile: AnyTile): tile is T => tile.type === this.type

  private rotate = (tile: T) => {
    this.setVariant(tile, (this.variantIndex(tile) + 1) % 4)
  }

  execute = (pos: Point, variant: number, existingTile: MaybeTile) => {
    if (this.clickPos?.x !== pos.x || this.clickPos?.y !== pos.y) {
      this.clickPos = pos
      this.clickCount = 0
    }
    this.clickCount++

    if (!existingTile) return this.createTile(pos, variant)

    if (this.matches(existingTile)) {
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
