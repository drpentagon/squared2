import { Canvas } from "../../canvas"
import { TILE } from "../../lib/constants"
import { ROTATE_BUTTON_STYLE } from "../../lib/styles"
import { writeMini } from "../../lib/text"
import { Point } from "../../lib/point"

const BUTTON_WIDTH = TILE.SIZE
const BUTTON_HEIGHT = TILE.SIZE
const BUTTON_GAP = TILE.SPACING

const RIGHT_BUTTON_OFFSET: Point = { x: BUTTON_WIDTH + BUTTON_GAP, y: 0 }

export interface RotationSource<T> {
  variantIndex: (tile: T) => number
  setVariant: (tile: T, variant: number) => void
}

const containsPoint = (pos: Point, point: Point): boolean =>
  point.x >= pos.x &&
  point.x < pos.x + BUTTON_WIDTH &&
  point.y >= pos.y &&
  point.y < pos.y + BUTTON_HEIGHT

export class RotationControl<T> {
  constructor(private source: RotationSource<T>) {}

  draw = (canvas: Canvas, pos: Point) => {
    const rightPos = { x: pos.x + RIGHT_BUTTON_OFFSET.x, y: pos.y + RIGHT_BUTTON_OFFSET.y }

    canvas.drawRect(pos, BUTTON_WIDTH, BUTTON_HEIGHT, ROTATE_BUTTON_STYLE)
    writeMini(canvas, "CCW", 1, 1, pos)

    canvas.drawRect(rightPos, BUTTON_WIDTH, BUTTON_HEIGHT, ROTATE_BUTTON_STYLE)
    writeMini(canvas, "CW", 1, 1, rightPos)
  }

  handleClick = (pos: Point, point: Point, tile: T): boolean => {
    const rightPos = { x: pos.x + RIGHT_BUTTON_OFFSET.x, y: pos.y + RIGHT_BUTTON_OFFSET.y }

    const isCounterClockwise = containsPoint(pos, point)
    const isClockwise = !isCounterClockwise && containsPoint(rightPos, point)

    if (!isCounterClockwise && !isClockwise) return false

    const current = this.source.variantIndex(tile)
    this.source.setVariant(tile, isClockwise ? (current + 1) % 4 : (current + 3) % 4)
    return true
  }
}
