import { FragileRedirectorTool } from "./fragile-redirector-tool"
import { GoalTool } from "./goal-tool"
import { RedirectorTool } from "./redirector-tool"
import { MaybeTile, Tool } from "./tool"
import { WallTool } from "./wall-tool"
import { Canvas } from "../canvas"
import { TOOL_SIZE, TOOL_STEP } from "../lib/constants"
import { Point } from "../lib/point"

export class ToolsPanel {
  private canvas: Canvas
  private tools: Tool[]
  selectedTool: Tool | null = null

  constructor() {
    const container = document.createElement("div")
    container.id = "tools-panel"
    container.className = "edit-panel"
    document.body.appendChild(container)

    this.canvas = new Canvas(0, container)
    this.canvas.el.addEventListener("click", this.handleClick)

    this.tools = [
      new WallTool(this.canvas),
      new RedirectorTool(this.canvas),
      new FragileRedirectorTool(this.canvas),
      new GoalTool(this.canvas),
    ]
  }

  private get horizontal() {
    return this.canvas.width > this.canvas.height
  }

  private toolPos = (index: number): Point => {
    return this.horizontal ? { x: index * TOOL_STEP, y: 0 } : { x: 0, y: index * TOOL_STEP }
  }

  private selectTool = (tool: Tool) => {
    if (this.selectedTool) this.selectedTool.selected = false
    this.selectedTool = tool
    tool.selected = true
  }

  private handleClick = (e: MouseEvent) => {
    const rect = this.canvas.el.getBoundingClientRect()
    const local: Point = { x: e.clientX - rect.left, y: e.clientY - rect.top }

    const tool = this.tools.find((_, index) => {
      const pos = this.toolPos(index)
      return (
        local.x >= pos.x &&
        local.x < pos.x + TOOL_SIZE &&
        local.y >= pos.y &&
        local.y < pos.y + TOOL_SIZE
      )
    })

    if (tool) this.selectTool(tool)
  }

  executeSelectedTool = (pos: Point, variant: number, existingTile: MaybeTile) => {
    if (this.selectedTool) return this.selectedTool.execute(pos, variant, existingTile)
    return
  }

  render = () => {
    this.canvas.resize()
    this.canvas.clear()

    this.tools.forEach((tool, index) => {
      tool.render(this.toolPos(index))
    })
  }
}

export const toolsPanel = new ToolsPanel()

export const setEditing = (editing: boolean) => {
  document.body.classList.toggle("editing", editing)
}
