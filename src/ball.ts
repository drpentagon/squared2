import { Canvas } from "./canvas"
import { origin } from "./grid"
import { GridObject } from "./grid-object"
import { BALL, DOT, GRID, OPPOSITE_DIRECTION, TILE, directions, tileTypes } from "./lib/constants"
import { rotatePolygon } from "./lib/geometry"
import { equals, Point } from "./lib/point"
import { BALL_STYLE } from "./lib/styles"
import { pixelToTile } from "./tiles/tile"

const DIRECTION_MARKER_OFFSET = BALL.RADIUS + DOT.SPACING

const DIRECTION_MARKER: [number, number][] = [
  [-BALL.RADIUS, -DIRECTION_MARKER_OFFSET],
  [BALL.RADIUS, -DIRECTION_MARKER_OFFSET],
  [BALL.RADIUS, -DIRECTION_MARKER_OFFSET - DOT.SIZE],
  [-BALL.RADIUS, -DIRECTION_MARKER_OFFSET - DOT.SIZE],
]

const DIRECTION_VECTOR: Record<string, Point> = {
  [directions.UP]: { x: 0, y: -1 },
  [directions.DOWN]: { x: 0, y: 1 },
  [directions.LEFT]: { x: -1, y: 0 },
  [directions.RIGHT]: { x: 1, y: 0 },
}

export class Ball extends GridObject {
  velocity: number
  directionVector: Point
  inNewTile: boolean
  #direction: string

  constructor(tilePos: Point, velocity: number, direction: string) {
    super(tilePos, {
      x: 3 * DOT.CC + tilePos.x * TILE.CC + BALL.RADIUS,
      y: 3 * DOT.CC + tilePos.y * TILE.CC + BALL.RADIUS,
    })
    this.velocity = velocity
    this.#direction = direction
    this.directionVector = DIRECTION_VECTOR[direction]
    this.inNewTile = false
  }

  get direction(): string {
    return this.#direction
  }

  set direction(direction: string) {
    this.#direction = direction
    this.directionVector = DIRECTION_VECTOR[direction]
  }

  get type() {
    return tileTypes.BALL
  }

  update(dt: number) {
    const { x: dx, y: dy } = this.directionVector

    this.pos.x += dx * this.velocity * dt
    this.pos.y += dy * this.velocity * dt

    this.pos.x = ((this.pos.x % GRID.SIZE) + GRID.SIZE) % GRID.SIZE
    this.pos.y = ((this.pos.y % GRID.SIZE) + GRID.SIZE) % GRID.SIZE

    const front: Point = {
      x: dx >= 0 ? this.pos.x + BALL.RADIUS : this.pos.x - BALL.RADIUS,
      y: dy >= 0 ? this.pos.y + BALL.RADIUS : this.pos.y - BALL.RADIUS,
    }

    const newTilePos = pixelToTile(front)
    this.inNewTile = !equals(newTilePos, this.tilePos)
    this.tilePos = newTilePos
  }

  perpendicularBounce(overlap: number) {
    const { x: dx, y: dy } = this.directionVector

    this.pos.x -= dx * overlap
    this.pos.y -= dy * overlap

    this.direction = OPPOSITE_DIRECTION[this.direction]
  }

  draw(
    canvas: Canvas,
    pos: Point = { x: origin.x + this.pos.x, y: origin.y + this.pos.y },
    editing = false,
  ) {
    canvas.drawSquare({ x: pos.x - BALL.RADIUS, y: pos.y - BALL.RADIUS }, BALL.SIZE, BALL_STYLE)

    if (editing) {
      canvas.drawPolygon(
        pos,
        rotatePolygon(DIRECTION_MARKER, this.direction, { x: 0, y: 0 }),
        BALL_STYLE,
      )
    }
  }
}
