import { Ball } from "./ball"
import { GridObject } from "./grid-object"
import { tileTypes } from "./lib/constants"
import { equals, Point } from "./lib/point"
import { PositionMap } from "./position-map"
import { Tile } from "./tiles/tile"

export class GameObjects {
  staticTiles = new PositionMap<Tile>()
  dynamicTiles = new PositionMap<Tile>()
  balls: Ball[] = []

  private findBall = (tilePos: Point): Ball | undefined =>
    this.balls.find((ball) => equals(ball.tilePos, tilePos))

  get = (tilePos: Point): GridObject | undefined =>
    this.staticTiles.get(tilePos) ?? this.dynamicTiles.get(tilePos) ?? this.findBall(tilePos)

  add = (tilePos: Point, object: GridObject): boolean => {
    const existing = this.get(tilePos)
    if (existing && existing.type !== object.type) return false

    this.remove(tilePos)

    switch (object.type) {
      case tileTypes.BALL:
        this.balls.push(object as Ball)
        break
      case tileTypes.WALL:
      case tileTypes.REDIRECTOR:
        this.staticTiles.set(object as Tile)
        break
      case tileTypes.GOAL:
      case tileTypes.FRAGILE_REDIRECTOR:
        this.dynamicTiles.set(object as Tile)
        break
    }
    return true
  }

  remove = (tilePos: Point) => {
    const existingBall = this.findBall(tilePos)
    if (existingBall) this.balls.splice(this.balls.indexOf(existingBall), 1)
    this.staticTiles.delete(tilePos)
    this.dynamicTiles.delete(tilePos)
  }

  clear = () => {
    this.staticTiles.clear()
    this.dynamicTiles.clear()
    this.balls.splice(0, this.balls.length)
  }

  purge = (): boolean => {
    let staticTileRemoved = false
    this.staticTiles.forEach((tile) => {
      if (tile.consumed) {
        this.staticTiles.delete(tile.tilePos)
        staticTileRemoved = true
      }
    })

    this.dynamicTiles.forEach((tile) => {
      if (tile.consumed) this.dynamicTiles.delete(tile.tilePos)
    })

    for (let i = this.balls.length - 1; i >= 0; i--) {
      if (this.balls[i].consumed) this.balls.splice(i, 1)
    }

    return staticTileRemoved
  }
}
