import { GraphicsLayer } from "./graphics-layer"
import { Ball } from "../ball"
import { origin } from "../grid"
import { GRID } from "../lib/constants"
import { PositionMap } from "../position-map"
import { Tile } from "../tiles/tile"

export class DynamicGraphics extends GraphicsLayer {
  private tiles: PositionMap<Tile>
  private balls: Ball[]

  constructor(tiles: PositionMap<Tile>, balls: Ball[]) {
    super(2)
    this.canvas.setClip(origin, GRID.SIZE, GRID.SIZE)

    this.tiles = tiles
    this.balls = balls
  }

  update = (_dt: number) => {
    this.balls.forEach((ball) => ball.update(_dt))
  }

  draw = (editing = false) => {
    this.canvas.clear()
    this.tiles.forEach((tile) => tile.draw(this.canvas, undefined, editing))
    this.balls.forEach((ball) => ball.draw(this.canvas, undefined, editing))
  }
}
