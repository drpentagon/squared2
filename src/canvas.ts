import { DOT_CC, DOT_SIZE } from "./lib/constants"
import { Style } from "./lib/style"

export class Canvas {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(layerLevel: number, container: HTMLElement = document.body) {
    this.el = document.createElement("canvas")
    this.el.className = "canvas-layer"
    this.el.style.zIndex = String(layerLevel)
    container.appendChild(this.el)
    this.ctx = this.el.getContext("2d")!
    this.ctx.imageSmoothingEnabled = false
    this.resize()
  }

  get width() {
    return this.ctx.canvas.width
  }

  get height() {
    return this.ctx.canvas.height
  }

  resize = () => {
    const { width, height } = this.el.getBoundingClientRect()
    this.el.width = width
    this.el.height = height
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  setClip = (x: number, y: number, width: number, height: number) => {
    this.ctx.beginPath()
    this.ctx.rect(x, y, width, height)
    this.ctx.clip()
  }

  fillDots = (x: number, y: number, cols: number, rows: number, style = new Style()) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.drawSquare(x + c * DOT_CC, y + r * DOT_CC, DOT_SIZE, style)
      }
    }
  }

  drawSquare = (x: number, y: number, size: number, style = new Style()) => {
    this.ctx.save()
    style.apply(this.ctx)
    this.ctx.fillRect(x, y, size, size)
    this.ctx.strokeRect(
      x + this.ctx.lineWidth / 2,
      y + this.ctx.lineWidth / 2,
      size - this.ctx.lineWidth,
      size - this.ctx.lineWidth,
    )
    this.ctx.restore()
  }

  drawPolygon = (
    originX: number,
    originY: number,
    points: [number, number][],
    style = new Style(),
  ) => {
    if (points.length < 2) return
    this.ctx.save()
    style.apply(this.ctx)
    this.ctx.lineWidth = style.borderWidth * 2
    this.ctx.beginPath()
    this.moveTo(originX, originY, ...points[0])
    for (let i = 1; i < points.length; i++) {
      this.lineTo(originX, originY, ...points[i])
    }
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  lineTo = (originX: number, originY: number, x: number = 0, y: number = 0) => {
    this.ctx.lineTo(originX + x, originY + y)
  }

  moveTo = (originX: number, originY: number, x: number = 0, y: number = 0) => {
    this.ctx.moveTo(originX + x, originY + y)
  }
}
