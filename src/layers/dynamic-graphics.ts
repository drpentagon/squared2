import { Ball } from "../ball"
import { Canvas } from "../canvas"
import { GRID_SIZE } from "../constants"
import { gridOrigin } from "../grid"
import { TileMap } from "../tiles/tile"
import { GraphicsLayer } from "./graphics-layer"

export class DynamicGraphics extends GraphicsLayer {
  protected canvas: Canvas
  private tiles: TileMap
  private balls: Ball[]

  constructor(tiles: TileMap, balls: Ball[]) {
    super()
    this.canvas = new Canvas(2)
    this.canvas.setClip(gridOrigin.x, gridOrigin.y, GRID_SIZE, GRID_SIZE)

    this.tiles = tiles
    this.balls = balls
  }

  update = (_dt: number) => {
    this.balls.forEach((ball) => ball.update(_dt))
    this.tiles.forEach((tile) => {
      if (tile.consumed) this.tiles.delete(tile.tileX, tile.tileY)
    })
  }

  draw = () => {
    this.canvas.clear()
    this.tiles.forEach((tile) => tile.draw(this.canvas))
    this.balls.forEach((ball) => ball.draw(this.canvas))
  }
}
