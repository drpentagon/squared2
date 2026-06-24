import { DOT_SPACING, SQUARE_SIZE } from "./constants"
import { gridOrigin } from "./grid"
import { Style } from "./style"
import { Tile } from "./tiles/tile"

export class Canvas {
  ctx: CanvasRenderingContext2D

  constructor(layerLevel: number) {
    const el = document.createElement("canvas")
    el.width = window.innerWidth
    el.height = window.innerHeight
    el.className = "canvas-layer"
    el.style.zIndex = String(layerLevel)
    document.body.appendChild(el)
    this.ctx = el.getContext("2d")!
    this.ctx.imageSmoothingEnabled = false
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
    this.ctx.save()
    this.ctx.fillRect(x, y, size, size)
    this.ctx.strokeRect(
      x + this.ctx.lineWidth / 2,
      y + this.ctx.lineWidth / 2,
      size - this.ctx.lineWidth,
      size - this.ctx.lineWidth,
    )
  }

  drawPolygon = (tile: Tile, points: [number, number][], style = new Style()) => {
    console.log(points)
    if (points.length < 2) return
    this.ctx.save()
    style.apply(this.ctx)
    this.ctx.lineWidth = style.borderWidth * 2
    this.ctx.beginPath()
    this.moveTo(tile, ...points[0])
    for (let i = 1; i < points.length; i++) {
      this.lineTo(tile, ...points[i])
    }
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  lineTo = (tile: Tile, x: number = 0, y: number = 0) => {
    this.ctx.lineTo(gridOrigin.x + tile.x + x, gridOrigin.y + tile.y + y)
  }

  moveTo = (tile: Tile, x: number = 0, y: number = 0) => {
    this.ctx.moveTo(gridOrigin.x + tile.x + x, gridOrigin.y + tile.y + y)
  }
}
