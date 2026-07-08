import { TileMap } from "../tiles/tile"
import { GraphicsLayer } from "./graphics-layer"

export class StaticGraphics extends GraphicsLayer {
  private tiles: TileMap

  constructor(tiles: TileMap) {
    super(1)
    this.tiles = tiles
  }

  update = (_dt: number) => {}

  draw = () => {
    this.tiles.forEach((tile) => tile.draw(this.canvas))
  }
}
