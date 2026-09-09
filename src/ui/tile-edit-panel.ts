import { DeleteButton } from "./elements/delete-button"
import { EditCommand } from "./elements/edit-command"
import { RotationControl } from "./elements/rotation-control"
import { SpeedButton } from "./elements/speed-button"
import { Tool } from "./tool"
import { GridObject } from "../grid-object"

export type EditCommandConstructor = new (tile: GridObject) => EditCommand

export const EditPanelCommand = {
  DELETE_BUTTON: DeleteButton,
  ROTATION_CONTROL: RotationControl,
  SPEED_BUTTON: SpeedButton,
} as const

export class TileEditPanel {
  private container: HTMLElement
  private tool: Tool | null = null
  private tile: GridObject | null = null

  constructor() {
    this.container = document.createElement("div")
    this.container.id = "tile-edit-panel"
    this.container.className = "edit-panel"
    document.body.appendChild(this.container)
  }

  setContent = (tool: Tool | null, tile: GridObject | null) => {
    if (tool === this.tool && tile === this.tile) return
    this.tool = tool
    this.tile = tile

    this.container.style.display = tool ? "flex" : "none"
    this.container.innerHTML = ""
    if (!tool || !tile) return

    for (const Command of [...tool.editPanelCommands()].reverse()) {
      const editCommand = new Command(tile)
      this.container.appendChild(editCommand.el)
    }
  }
}

export const tileEditPanel = new TileEditPanel()
