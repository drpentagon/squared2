import { GraphicsLayer } from "./graphics-layer"
import { GameObjects } from "../game-objects"
import { origin } from "../grid"
import { LevelEntry, loadGameObjects } from "../level"
import { DOT, GRID, TILE } from "../lib/constants"
import { Point } from "../lib/point"
import { Style } from "../lib/style"

export const NEW_LEVEL = "NEW_LEVEL"
export type OverviewChoice = number | typeof NEW_LEVEL | null

const COLUMNS = 6
const THUMBNAIL_STEP = TILE.COUNT + 1
const MARGIN = Math.floor((DOT.GRID_SIZE - (COLUMNS * THUMBNAIL_STEP - 1)) / 2)

const DASH_PERIOD = 4
const DASH_LENGTH = 3
const DASH_OFFSET = 1
const PLUS_REACH = 2
const CENTER = (TILE.COUNT - 1) / 2

const BACKDROP_STYLE = new Style("#051e06")
const NEW_LEVEL_STYLE = new Style("#ffffff")

const ring = (): Point[] => {
  const max = TILE.COUNT - 1
  const positions: Point[] = []

  for (let x = 0; x <= max; x++) positions.push({ x, y: 0 })
  for (let y = 1; y <= max; y++) positions.push({ x: max, y })
  for (let x = max - 1; x >= 0; x--) positions.push({ x, y: max })
  for (let y = max - 1; y >= 1; y--) positions.push({ x: 0, y })

  return positions
}

const RING = ring()

export class LevelOverview extends GraphicsLayer {
  private levels: LevelEntry[] = []
  private visible = false
  private onSelect: ((choice: OverviewChoice) => void) | null = null

  constructor() {
    super(4)
    this.canvas.setClip(origin, GRID.SIZE, GRID.SIZE)
    this.canvas.el.style.pointerEvents = "none"
    this.canvas.el.addEventListener("click", this.handleClick)
  }

  get isOpen() {
    return this.visible
  }

  show = (levels: LevelEntry[]): Promise<OverviewChoice> => {
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
    this.drawNewLevelButton(this.levels.length)
  }

  private drawThumbnail = (level: LevelEntry, index: number) => {
    const gameObjects = new GameObjects()
    loadGameObjects(gameObjects, level.data)
    gameObjects.renderMiniature(this.canvas, this.thumbnailOrigin(index))
  }

  private drawNewLevelButton = (index: number) => {
    const pos = this.thumbnailOrigin(index)

    RING.forEach((tile, i) => {
      if ((i + DASH_OFFSET) % DASH_PERIOD < DASH_LENGTH) this.drawDot(pos, tile)
    })

    for (let offset = -PLUS_REACH; offset <= PLUS_REACH; offset++) {
      this.drawDot(pos, { x: CENTER + offset, y: CENTER })
      this.drawDot(pos, { x: CENTER, y: CENTER + offset })
    }
  }

  private drawDot = (thumbnail: Point, tile: Point) => {
    this.canvas.drawSquare(
      { x: thumbnail.x + tile.x * DOT.CC, y: thumbnail.y + tile.y * DOT.CC },
      DOT.SIZE,
      NEW_LEVEL_STYLE,
    )
  }

  private thumbnailOrigin = (index: number): Point => ({
    x: origin.x + (MARGIN + (index % COLUMNS) * THUMBNAIL_STEP) * DOT.CC,
    y: origin.y + (MARGIN + Math.floor(index / COLUMNS) * THUMBNAIL_STEP) * DOT.CC,
  })

  private handleClick = (e: MouseEvent) => {
    if (!this.visible) return
    e.stopPropagation()

    const slot = this.slotAt({ x: e.clientX - origin.x, y: e.clientY - origin.y })
    if (slot === null) {
      this.close(null)
      return
    }

    if (slot === this.levels.length) {
      this.close(NEW_LEVEL)
      return
    }

    this.close(this.levels[slot]?.id ?? null)
  }

  private slotAt = (local: Point): number | null => {
    const dotX = local.x / DOT.CC - MARGIN
    const dotY = local.y / DOT.CC - MARGIN
    if (dotX < 0 || dotY < 0) return null
    if (dotX % THUMBNAIL_STEP >= TILE.COUNT || dotY % THUMBNAIL_STEP >= TILE.COUNT) return null

    const col = Math.floor(dotX / THUMBNAIL_STEP)
    if (col >= COLUMNS) return null

    return Math.floor(dotY / THUMBNAIL_STEP) * COLUMNS + col
  }

  private close = (choice: OverviewChoice) => {
    this.visible = false
    this.canvas.el.style.pointerEvents = "none"
    this.clear()

    this.onSelect?.(choice)
    this.onSelect = null
  }
}
