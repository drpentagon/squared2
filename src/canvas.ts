import { DOT_CC, DOT_SIZE } from "./lib/constants"
import { Point } from "./lib/point"
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

  setClip = (origin: Point, width: number, height: number) => {
    this.ctx.beginPath()
    this.ctx.rect(origin.x, origin.y, width, height)
    this.ctx.clip()
  }

  fillDots = (origin: Point, cols: number, rows: number, style = new Style()) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.drawSquare({ x: origin.x + c * DOT_CC, y: origin.y + r * DOT_CC }, DOT_SIZE, style)
      }
    }
  }

  drawSquare = (origin: Point, size: number, style = new Style()) => {
    this.ctx.save()
    style.apply(this.ctx)
    this.ctx.fillRect(origin.x, origin.y, size, size)
    this.ctx.strokeRect(
      origin.x + this.ctx.lineWidth / 2,
      origin.y + this.ctx.lineWidth / 2,
      size - this.ctx.lineWidth,
      size - this.ctx.lineWidth,
    )
    this.ctx.restore()
  }

  drawPolygon = (origin: Point, points: [number, number][], style = new Style()) => {
    if (points.length < 2) return
    this.ctx.save()
    style.apply(this.ctx)
    this.ctx.lineWidth = style.borderWidth * 2
    this.ctx.beginPath()
    this.moveTo(origin, { x: points[0][0], y: points[0][1] })
    for (let i = 1; i < points.length; i++) {
      this.lineTo(origin, { x: points[i][0], y: points[i][1] })
    }
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  lineTo = (origin: Point, offset: Point = { x: 0, y: 0 }) => {
    this.ctx.lineTo(origin.x + offset.x, origin.y + offset.y)
  }

  moveTo = (origin: Point, offset: Point = { x: 0, y: 0 }) => {
    this.ctx.moveTo(origin.x + offset.x, origin.y + offset.y)
  }
}
