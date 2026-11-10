import { DeleteButton } from "./elements/delete-button"
import { DividerCommand } from "./elements/divider-command"
import { EditCommand } from "./elements/edit-command"
import { RotatesToggle } from "./elements/rotates-toggle"
import { RotationControl } from "./elements/rotation-control"
import { SpeedButton } from "./elements/speed-button"
import { TileTool } from "./tile-tool"
import { GridObject } from "../grid-object"

export type EditCommandConstructor = new (tile: GridObject, onChange: () => void) => EditCommand

export const EditPanelCommand = {
  DELETE_BUTTON: DeleteButton,
  DIVIDER: DividerCommand,
  ROTATES_TOGGLE: RotatesToggle,
  ROTATION_CONTROL: RotationControl,
  SPEED_BUTTON: SpeedButton,
} as const

export class TileEditPanel {
  private container: HTMLElement
  private tool: TileTool<GridObject> | null = null
  private tile: GridObject | null = null

  constructor() {
    this.container = document.createElement("div")
    this.container.id = "tile-edit-panel"
    this.container.className = "panel panel--edit_level panel--hidden"
    document.body.appendChild(this.container)
  }

  setContent = (
    tool: TileTool<GridObject> | null,
    tile: GridObject | null,
    onChange: () => void,
  ) => {
    if (tool === this.tool && tile === this.tile) return
    this.tool = tool
    this.tile = tile

    this.container.classList.toggle("panel--hidden", !tool)
    this.container.innerHTML = ""
    if (!tool || !tile) return

    for (const Command of [...tool.editPanelCommands()].reverse()) {
      const editCommand = new Command(tile, onChange)
      this.container.appendChild(editCommand.el)
    }
  }
}

export const tileEditPanel = new TileEditPanel()
