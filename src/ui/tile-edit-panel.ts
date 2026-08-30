import { RotatingTileTool } from "./rotating-tile-tool"
import { AnyTile, Tool } from "./tool"
import { Canvas } from "../canvas"
import { DELETE_BUTTON, DOT, ROTATION_CONTROL } from "../lib/constants"
import { PANEL_DOT } from "../lib/styles"
import { Point } from "../lib/point"

export const EditPanelCommand = {
  DELETE_BUTTON: "DELETE_BUTTON",
  ROTATION_CONTROL: "ROTATION_CONTROL",
} as const
export type EditPanelCommand = (typeof EditPanelCommand)[keyof typeof EditPanelCommand]

const ELEMENT_HEIGHT: Record<EditPanelCommand, number> = {
  [EditPanelCommand.DELETE_BUTTON]: DELETE_BUTTON.HEIGHT,
  [EditPanelCommand.ROTATION_CONTROL]: ROTATION_CONTROL.HEIGHT,
}

const isRotatingTool = (tool: Tool): tool is RotatingTileTool<AnyTile> =>
  tool instanceof RotatingTileTool

export class TileEditPanel {
  private container: HTMLElement
  private canvas: Canvas
  private visible = false
  private tool: Tool | null = null
  private tile: AnyTile | null = null

  onDelete: () => void = () => {}

  constructor() {
    this.container = document.createElement("div")
    this.container.id = "tile-edit-panel"
    this.container.className = "edit-panel"
    this.container.style.display = "none"
    document.body.appendChild(this.container)

    this.canvas = new Canvas(0, this.container)
    this.canvas.el.addEventListener("click", this.handleClick)
  }

  setContent = (tool: Tool | null, tile: AnyTile | null) => {
    this.tool = tool
    this.tile = tile
    this.visible = tool !== null

    this.container.style.display = this.visible ? "block" : "none"
    if (this.visible && this.tool) {
      const height = this.tool
        .editPanelCommands()
        .reduce((sum, command) => sum + ELEMENT_HEIGHT[command] + DOT.CC, DOT.CC)
      this.container.style.height = `${height}px`
    }
  }

  private commandOrigins = (): [EditPanelCommand, Point][] => {
    if (!this.tool) return []

    const origins: [EditPanelCommand, Point][] = []
    let y = DOT.CC
    for (const command of [...this.tool.editPanelCommands()].reverse()) {
      origins.push([command, { x: DOT.CC, y }])
      y += ELEMENT_HEIGHT[command] + DOT.CC
    }
    return origins
  }

  private handleClick = (e: MouseEvent) => {
    if (!this.tool) return

    const rect = this.canvas.el.getBoundingClientRect()
    const point: Point = { x: e.clientX - rect.left, y: e.clientY - rect.top }

    for (const [command, pos] of this.commandOrigins()) {
      if (
        command === EditPanelCommand.DELETE_BUTTON &&
        this.tool.deleteButton.contains(pos, point)
      ) {
        this.onDelete()
        return
      }
      if (command === EditPanelCommand.ROTATION_CONTROL && isRotatingTool(this.tool) && this.tile) {
        if (this.tool.rotationControl.handleClick(pos, point, this.tile)) return
      }
    }
  }

  render = () => {
    if (!this.visible || !this.tool) return

    this.canvas.resize()
    this.canvas.clear()

    this.canvas.drawRect({ x: 0, y: 0 }, this.canvas.width, this.canvas.height, PANEL_DOT)

    for (const [command, pos] of this.commandOrigins()) {
      if (command === EditPanelCommand.DELETE_BUTTON) this.tool.deleteButton.draw(this.canvas, pos)
      if (command === EditPanelCommand.ROTATION_CONTROL && isRotatingTool(this.tool)) {
        this.tool.rotationControl.draw(this.canvas, pos)
      }
    }
  }
}

export const tileEditPanel = new TileEditPanel()
