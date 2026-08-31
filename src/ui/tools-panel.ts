import { BallTool } from "./ball-tool"
import { ClearLevelTool } from "./clear-level-tool"
import { FragileRedirectorTool } from "./fragile-redirector-tool"
import { GoalTool } from "./goal-tool"
import { RedirectorTool } from "./redirector-tool"
import { MaybeTile, Tool } from "./tool"
import { WallTool } from "./wall-tool"
import { Canvas } from "../canvas"
import { TOOL } from "../lib/constants"
import { Point } from "../lib/point"

export class ToolsPanel {
  private canvas: Canvas
  private tools: Tool[]
  readonly clearLevelTool: ClearLevelTool
  selectedTool: Tool | null = null

  constructor() {
    const container = document.createElement("div")
    container.id = "tools-panel"
    container.className = "canvas-panel"
    document.body.appendChild(container)

    this.canvas = new Canvas(0, container)
    this.canvas.el.addEventListener("click", this.handleClick)

    this.clearLevelTool = new ClearLevelTool(this.canvas)
    this.tools = [
      new WallTool(this.canvas),
      new RedirectorTool(this.canvas),
      new FragileRedirectorTool(this.canvas),
      new BallTool(this.canvas),
      new GoalTool(this.canvas),
      this.clearLevelTool,
    ]
  }

  private get horizontal() {
    return this.canvas.width > this.canvas.height
  }

  private toolPos = (index: number): Point => {
    return this.horizontal ? { x: index * TOOL.STEP, y: 0 } : { x: 0, y: index * TOOL.STEP }
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
        local.x < pos.x + TOOL.SIZE &&
        local.y >= pos.y &&
        local.y < pos.y + TOOL.SIZE
      )
    })

    if (tool) this.selectTool(tool)
  }

  executeSelectedTool = (pos: Point, variant: number, existingTile: MaybeTile) => {
    if (this.selectedTool) return this.selectedTool.execute(pos, variant, existingTile)
    return
  }

  findToolByType = (type: string): Tool | undefined => this.tools.find((t) => t.type === type)

  selectToolForType = (type: string) => {
    const tool = this.findToolByType(type)
    if (tool) this.selectTool(tool)
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
