import { GraphicsLayer } from "./graphics-layer"
import { origin } from "../grid"
import { DOT_CC, TILE_CC, TILE_SIZE } from "../lib/constants"
import { Point } from "../lib/point"
import { SELECTED } from "../lib/styles"

const MARKER_SIZE = TILE_SIZE + 2 * DOT_CC

export class SelectionGraphics extends GraphicsLayer {
  constructor() {
    super(0)
  }

  update = (_dt: number) => {}

  draw = (tilePos: Point | null = null) => {
    this.canvas.clear()
    if (!tilePos) return

    this.canvas.drawSquare(
      { x: origin.x + tilePos.x * TILE_CC, y: origin.y + tilePos.y * TILE_CC },
      MARKER_SIZE,
      SELECTED,
    )
  }
}
