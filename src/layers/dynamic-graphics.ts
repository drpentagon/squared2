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

  purge = (): boolean => {
    this.tiles.forEach((tile) => {
      if (tile.consumed) this.tiles.delete(tile.tilePos)
    })
    for (let i = this.balls.length - 1; i >= 0; i--) {
      if (this.balls[i].consumed) this.balls.splice(i, 1)
    }
    return this.balls.length === 0
  }

  draw = (editing = false) => {
    this.canvas.clear()
    this.tiles.forEach((tile) => tile.draw(this.canvas, undefined, editing))
    this.balls.forEach((ball) => ball.draw(this.canvas, undefined, editing))
  }
}
