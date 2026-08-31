import { GraphicsLayer } from "./graphics-layer"
import { PositionMap } from "../position-map"
import { Tile } from "../tiles/tile"

export class StaticGraphics extends GraphicsLayer {
  private tiles: PositionMap<Tile>

  constructor(tiles: PositionMap<Tile>) {
    super(1)
    this.tiles = tiles
  }

  update = (_dt: number) => {}

  draw = () => {
    this.tiles.forEach((tile) => tile.draw(this.canvas))
  }
}
