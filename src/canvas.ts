import { viewport } from "./grid"
import { DOT } from "./lib/constants"
import { Point } from "./lib/point"
import { Style } from "./lib/style"

type CanvasOptions = { container?: HTMLElement; modifier?: string; scaled?: boolean }

const canvases = new Set<Canvas>()

export const syncCanvases = () => canvases.forEach((canvas) => canvas.sync())

export class Canvas {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  #scaled: boolean
  #clip: { origin: Point; width: number; height: number } | null = null

  constructor(
    layerLevel: number,
    { container = document.body, modifier = "", scaled = false }: CanvasOptions = {},
  ) {
    this.el = document.createElement("canvas")
    this.el.className = modifier ? `canvas-layer canvas-layer--${modifier}` : "canvas-layer"
    this.el.style.zIndex = String(layerLevel)
    container.appendChild(this.el)
    this.ctx = this.el.getContext("2d")!

    this.#scaled = scaled
    canvases.add(this)
    this.sync()
  }

  get width() {
    return this.ctx.canvas.width
  }

  get height() {
    return this.ctx.canvas.height
  }

  sync = () => {
    const { width, height } = this.el.getBoundingClientRect()
    this.el.width = width
    this.el.height = height

    const scale = this.#scaled ? viewport.scale : 1
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0)
    this.ctx.imageSmoothingEnabled = false

    if (this.#clip) this.#applyClip()
  }

  clear = () => {
    this.ctx.save()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.restore()
  }

  remove = () => {
    canvases.delete(this)
    this.el.remove()
  }

  setClip = (clipOrigin: Point, width: number, height: number) => {
    this.#clip = { origin: clipOrigin, width, height }
    this.#applyClip()
  }

  fillDots = (origin: Point, cols: number, rows: number, style = new Style()) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.drawSquare({ x: origin.x + c * DOT.CC, y: origin.y + r * DOT.CC }, DOT.SIZE, style)
      }
    }
  }

  drawSquare = (origin: Point, size: number, style = new Style()) => {
    this.drawRect(origin, size, size, style)
  }

  drawRect = (origin: Point, width: number, height: number, style = new Style()) => {
    this.ctx.save()
    style.apply(this.ctx)
    this.ctx.fillRect(origin.x, origin.y, width, height)
    this.ctx.strokeRect(
      origin.x + this.ctx.lineWidth / 2,
      origin.y + this.ctx.lineWidth / 2,
      width - this.ctx.lineWidth,
      height - this.ctx.lineWidth,
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

  #applyClip = () => {
    const { origin, width, height } = this.#clip!

    this.ctx.beginPath()
    this.ctx.rect(origin.x, origin.y, width, height)
    this.ctx.clip()
  }
}
