import { Canvas } from "../canvas"
import { TileMap } from "../tile"
import { GraphicsLayer } from "./graphics-layer"

export class StaticGraphics extends GraphicsLayer {
  protected canvas: Canvas
  private tiles: TileMap

  constructor(tiles: TileMap) {
    super()
    this.canvas = new Canvas(1)
    this.tiles = tiles
  }

  update = (_dt: number) => {}

  draw = () => {
    this.tiles.forEach((tile) => tile.draw(this.canvas))
  }
}
