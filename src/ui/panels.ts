import { DOT_CC, DOT_SIZE } from "../lib/constants"
import { PANEL_DOT } from "../lib/styles"

export class Panel {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor(container: HTMLElement) {
    this.canvas = document.createElement("canvas")
    container.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d")!
    this.ctx.imageSmoothingEnabled = false
  }

  render = () => {
    const { width, height } = this.canvas.getBoundingClientRect()
    this.canvas.width = width
    this.canvas.height = height

    this.ctx.clearRect(0, 0, width, height)
    PANEL_DOT.apply(this.ctx)
    for (let y = 0; y + DOT_SIZE <= height; y += DOT_CC) {
      for (let x = 0; x + DOT_SIZE <= width; x += DOT_CC) {
        this.ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE)
      }
    }
  }
}

const createContainer = (id: string) => {
  const el = document.createElement("div")
  el.id = id
  el.className = "edit-panel"
  document.body.appendChild(el)
  return el
}

export const toolsPanel = new Panel(createContainer("tools-panel"))
export const optionsPanel = new Panel(createContainer("options-panel"))

export const setEditing = (editing: boolean) => {
  document.body.classList.toggle("editing", editing)
}
