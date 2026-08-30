import { Canvas } from "./canvas"
import { origin } from "./grid"
import { BALL, DOT, GRID, TILE, directions, tileTypes } from "./lib/constants"
import { rotatePolygon } from "./lib/geometry"
import { Point } from "./lib/point"
import { BALL_STYLE } from "./lib/styles"
import { pixelToTile } from "./tiles/tile"

const { UP, DOWN, LEFT, RIGHT } = directions

const DIRECTION_MARKER_OFFSET = BALL.RADIUS + DOT.SPACING

const DIRECTION_MARKER: [number, number][] = [
  [-BALL.RADIUS, -DIRECTION_MARKER_OFFSET],
  [BALL.RADIUS, -DIRECTION_MARKER_OFFSET],
  [BALL.RADIUS, -DIRECTION_MARKER_OFFSET - DOT.SIZE],
  [-BALL.RADIUS, -DIRECTION_MARKER_OFFSET - DOT.SIZE],
]

const BALL_CENTER: Point = { x: 0, y: 0 }

export class Ball {
  tilePos: Point
  oldTilePos: Point
  pos: Point
  vx: number
  vy: number
  consumed: boolean

  constructor(tilePos: Point, vx: number, vy: number) {
    this.tilePos = tilePos
    this.oldTilePos = { x: -1, y: -1 }
    this.vx = vx
    this.vy = vy
    this.consumed = false

    this.pos = {
      x: 3 * DOT.CC + tilePos.x * TILE.CC + BALL.RADIUS,
      y: 3 * DOT.CC + tilePos.y * TILE.CC + BALL.RADIUS,
    }
  }

  get type() {
    return tileTypes.BALL
  }

  update(dt: number) {
    this.pos.x += this.vx * dt
    this.pos.y += this.vy * dt

    this.pos.x = ((this.pos.x % GRID.SIZE) + GRID.SIZE) % GRID.SIZE
    this.pos.y = ((this.pos.y % GRID.SIZE) + GRID.SIZE) % GRID.SIZE

    const leading: Point = {
      x: this.vx >= 0 ? this.pos.x + BALL.RADIUS : this.pos.x - BALL.RADIUS,
      y: this.vy >= 0 ? this.pos.y + BALL.RADIUS : this.pos.y - BALL.RADIUS,
    }

    this.oldTilePos = { x: this.tilePos.x, y: this.tilePos.y }
    this.tilePos = pixelToTile(leading)
  }

  perpendicularBounce(overlap: number) {
    this.pos.x -= Math.sign(this.vx) * overlap
    this.pos.y -= Math.sign(this.vy) * overlap

    this.vx = -this.vx
    this.vy = -this.vy
  }

  inNewTile() {
    return this.oldTilePos.x !== this.tilePos.x || this.oldTilePos.y !== this.tilePos.y
  }

  direction() {
    if (this.vy < 0) return UP
    if (this.vy > 0) return DOWN
    if (this.vx > 0) return RIGHT
    return LEFT
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
        rotatePolygon(DIRECTION_MARKER, this.direction(), BALL_CENTER),
        BALL_STYLE,
      )
    }
  }
}
