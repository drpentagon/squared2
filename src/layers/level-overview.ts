import { GraphicsLayer } from "./graphics-layer"
import { GameObjects } from "../game-objects"
import { origin } from "../grid"
import { LevelEntry, loadGameObjects } from "../level"
import { DOT, GRID, TILE } from "../lib/constants"
import { Point } from "../lib/point"
import { Style } from "../lib/style"

const COLUMNS = 6
const THUMBNAIL_STEP = TILE.COUNT + 1
const MARGIN = Math.floor((DOT.GRID_SIZE - (COLUMNS * THUMBNAIL_STEP - 1)) / 2)

const BACKDROP_STYLE = new Style("#051e06")

export class LevelOverview extends GraphicsLayer {
  private levels: LevelEntry[] = []
  private visible = false
  private onSelect: ((id: number | null) => void) | null = null

  constructor() {
    super(4)
    this.canvas.setClip(origin, GRID.SIZE, GRID.SIZE)
    this.canvas.el.style.pointerEvents = "none"
    this.canvas.el.addEventListener("click", this.handleClick)
  }

  get isOpen() {
    return this.visible
  }

  show = (levels: LevelEntry[]): Promise<number | null> => {
    this.levels = levels
    this.visible = true
    this.canvas.el.style.pointerEvents = "auto"
    this.draw()

    return new Promise((resolve) => {
      this.onSelect = resolve
    })
  }

  dismiss = () => {
    if (this.visible) this.close(null)
  }

  draw = () => {
    this.canvas.clear()
    this.canvas.drawSquare(origin, GRID.SIZE, BACKDROP_STYLE)
    this.levels.forEach(this.drawThumbnail)
  }

  private drawThumbnail = (level: LevelEntry, index: number) => {
    const gameObjects = new GameObjects()
    loadGameObjects(gameObjects, level.data)
    gameObjects.renderMiniature(this.canvas, this.thumbnailOrigin(index))
  }

  private thumbnailOrigin = (index: number): Point => ({
    x: origin.x + (MARGIN + (index % COLUMNS) * THUMBNAIL_STEP) * DOT.CC,
    y: origin.y + (MARGIN + Math.floor(index / COLUMNS) * THUMBNAIL_STEP) * DOT.CC,
  })

  private handleClick = (e: MouseEvent) => {
    if (!this.visible) return
    e.stopPropagation()

    const level = this.levelAt({ x: e.clientX - origin.x, y: e.clientY - origin.y })
    this.close(level?.id ?? null)
  }

  private levelAt = (local: Point): LevelEntry | null => {
    const dotX = local.x / DOT.CC - MARGIN
    const dotY = local.y / DOT.CC - MARGIN
    if (dotX < 0 || dotY < 0) return null
    if (dotX % THUMBNAIL_STEP >= TILE.COUNT || dotY % THUMBNAIL_STEP >= TILE.COUNT) return null

    const col = Math.floor(dotX / THUMBNAIL_STEP)
    if (col >= COLUMNS) return null

    return this.levels[Math.floor(dotY / THUMBNAIL_STEP) * COLUMNS + col] ?? null
  }

  private close = (id: number | null) => {
    this.visible = false
    this.canvas.el.style.pointerEvents = "none"
    this.clear()

    this.onSelect?.(id)
    this.onSelect = null
  }
}
