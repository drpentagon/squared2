import { Canvas } from "../canvas"
import { DOT_CC, DOT_SIZE, TOOL_INNER_OFFSET, TOOL_INNER_SIZE, TOOL_STEP } from "../lib/constants"
import { PANEL_DOT } from "../lib/styles"
import { FragileRedirectorTool } from "./fragile-redirector-tool"
import { GoalTool } from "./goal-tool"
import { RedirectorTool } from "./redirector-tool"
import { MaybeTile, Tool } from "./tool"
import { WallTool } from "./wall-tool"

export class ToolsPanel {
  private canvas: Canvas
  private tools: Tool[]
  private currentTool: Tool | null = null

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

  get selectedTool() {
    return this.currentTool
  }

  private get horizontal() {
    return this.canvas.width > this.canvas.height
  }

  private toolPosition = (index: number): [number, number] => {
    return this.horizontal ? [index * TOOL_STEP, 0] : [0, index * TOOL_STEP]
  }

  private selectTool = (tool: Tool) => {
    if (this.currentTool) this.currentTool.selected = false
    this.currentTool = tool
    tool.selected = true
  }

  private handleClick = (e: MouseEvent) => {
    const rect = this.canvas.el.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top

    const tool = this.tools.find((_, index) => {
      const [x, y] = this.toolPosition(index)
      const innerX = x + TOOL_INNER_OFFSET
      const innerY = y + TOOL_INNER_OFFSET
      return (
        localX >= innerX &&
        localX < innerX + TOOL_INNER_SIZE &&
        localY >= innerY &&
        localY < innerY + TOOL_INNER_SIZE
      )
    })

    if (tool) this.selectTool(tool)
  }

  executeSelectedTool = (
    tileX: number,
    tileY: number,
    variant: number,
    existingTile: MaybeTile,
  ) => {
    if (this.currentTool) return this.currentTool.execute(tileX, tileY, variant, existingTile)
    return
  }

  render = () => {
    this.canvas.resize()
    this.canvas.clear()

    const cols = Math.floor((this.canvas.width - DOT_SIZE) / DOT_CC) + 1
    const rows = Math.floor((this.canvas.height - DOT_SIZE) / DOT_CC) + 1
    this.canvas.fillDots(0, 0, cols, rows, PANEL_DOT)

    this.tools.forEach((tool, index) => {
      const [x, y] = this.toolPosition(index)
      tool.render(x, y)
    })
  }
}

export const toolsPanel = new ToolsPanel()

export const setEditing = (editing: boolean) => {
  document.body.classList.toggle("editing", editing)
}
