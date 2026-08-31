import { DeleteButton } from "./elements/delete-button"
import { RotatingTileTool } from "./rotating-tile-tool"
import { Tool } from "./tool"
import { GridObject } from "../grid-object"

export const EditPanelCommand = {
  DELETE_BUTTON: "DELETE_BUTTON",
  ROTATION_CONTROL: "ROTATION_CONTROL",
} as const
export type EditPanelCommand = (typeof EditPanelCommand)[keyof typeof EditPanelCommand]

const isRotatingTool = (tool: Tool): tool is RotatingTileTool<GridObject> =>
  tool instanceof RotatingTileTool

export class TileEditPanel {
  private container: HTMLElement
  private tool: Tool | null = null
  private tile: GridObject | null = null
  private deleteButton = new DeleteButton()

  onDelete: () => void = () => {}

  constructor() {
    this.container = document.createElement("div")
    this.container.id = "tile-edit-panel"
    this.container.className = "edit-panel"
    document.body.appendChild(this.container)

    this.deleteButton.onClick = () => this.onDelete()
  }

  setContent = (tool: Tool | null, tile: GridObject | null) => {
    if (tool === this.tool && tile === this.tile) return
    this.tool = tool
    this.tile = tile

    this.container.style.display = tool ? "flex" : "none"
    this.container.innerHTML = ""
    if (!tool) return

    for (const command of [...tool.editPanelCommands()].reverse()) {
      if (command === EditPanelCommand.DELETE_BUTTON) {
        this.container.appendChild(this.deleteButton.el)
      }
      if (command === EditPanelCommand.ROTATION_CONTROL && isRotatingTool(tool)) {
        tool.rotationControl.setTile(tile)
        this.container.appendChild(tool.rotationControl.el)
      }
    }
  }
}

export const tileEditPanel = new TileEditPanel()
