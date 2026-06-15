import { Style } from "./style"

export class Canvas {
  private ctx: CanvasRenderingContext2D

  constructor(layerLevel: number) {
    const el = document.createElement("canvas")
    el.width = window.innerWidth
    el.height = window.innerHeight
    el.className = "canvas-layer"
    el.style.zIndex = String(layerLevel)
    document.body.appendChild(el)
    this.ctx = el.getContext("2d")!
  }

  get width() {
    return this.ctx.canvas.width
  }

  get height() {
    return this.ctx.canvas.height
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  setClip = (x: number, y: number, width: number, height: number) => {
    this.ctx.beginPath()
    this.ctx.rect(x, y, width, height)
    this.ctx.clip()
  }

  drawSquare = (x: number, y: number, size: number, style = new Style()) => {
    style.apply(this.ctx)
    this.ctx.fillRect(x, y, size, size)
    this.ctx.strokeRect(x, y, size, size)
  }
}
