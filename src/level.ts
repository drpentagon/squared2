import { Ball } from "./ball"
import { BackgroundGraphics } from "./layers/background-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { tileTypes } from "./lib/constants"
import { Point } from "./lib/point"
import { FragileRedirector } from "./tiles/fragile-redirector"
import { Goal } from "./tiles/goal"
import { Redirector } from "./tiles/redirector"
import { Tile, TileMap } from "./tiles/tile"
import { Wall } from "./tiles/wall"

export type WallData = Point
export type WallRangeData = { from: Point; to: Point }
export type RedirectorData = Point & { variant: number }
export type GoalData = Point & { direction: number; rotates?: boolean }
export type BallData = Point & { vx: number; vy: number }

export type LevelData = {
  walls: WallData[]
  wallRanges: WallRangeData[]
  fragileRedirects: RedirectorData[]
  permanentRedirects: RedirectorData[]
  goals: GoalData[]
  balls: BallData[]
}

export class Level {
  data: LevelData
  staticTiles: TileMap
  dynamicTiles: TileMap
  balls: Ball[]

  backgroundGraphics: BackgroundGraphics
  staticGraphics: StaticGraphics
  dynamicGraphics: DynamicGraphics

  constructor(data: LevelData) {
    this.data = data
    this.staticTiles = new TileMap()
    this.dynamicTiles = new TileMap()
    this.balls = []

    this.backgroundGraphics = new BackgroundGraphics()
    this.staticGraphics = new StaticGraphics(this.staticTiles)
    this.reset()
    this.dynamicGraphics = new DynamicGraphics(this.dynamicTiles, this.balls)
  }

  reset = () => {
    this.staticTiles.clear()
    this.staticTiles.addArray(this.data.walls.map((t) => new Wall(t)))
    this.staticTiles.addArray(this.data.wallRanges.flatMap(wallsInRange))
    this.staticTiles.addArray(this.data.permanentRedirects.map((t) => new Redirector(t, t.variant)))

    this.dynamicTiles.clear()
    this.dynamicTiles.addArray(
      this.data.fragileRedirects.map((t) => new FragileRedirector(t, t.variant)),
    )
    this.dynamicTiles.addArray(this.data.goals.map((t) => new Goal(t, t.direction, t.rotates)))

    this.balls.splice(0, this.balls.length, ...this.data.balls.map((b) => new Ball(b, b.vx, b.vy)))

    this.backgroundGraphics.clear()
    this.backgroundGraphics.draw()
    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  update = (dt: number) => {
    this.balls.forEach((ball) => {
      this.staticTiles.get(ball.tilePos)?.interact(ball)
      this.dynamicTiles.get(ball.tilePos)?.interact(ball)
    })

    this.dynamicGraphics.update(dt)
  }

  getTile = (tilePos: Point): Tile | undefined => {
    return this.staticTiles.get(tilePos) ?? this.dynamicTiles.get(tilePos)
  }

  addTile = (tilePos: Point, tile: Ball | Tile) => {
    if (!tile) return

    const existingBall = this.balls.find(
      (ball) => ball.tilePos.x === tilePos.x && ball.tilePos.y === tilePos.y,
    )
    const existingTile = this.staticTiles.get(tilePos) ?? this.dynamicTiles.get(tilePos)
    const existing = existingBall ?? existingTile

    if (existing && existing.type !== tile.type) return

    this.removeTile(tilePos)

    switch (tile.type) {
      case tileTypes.BALL:
        this.balls.push(tile as Ball)
        break
      case tileTypes.WALL:
      case tileTypes.REDIRECTOR:
        this.staticTiles.set(tile as Tile)
        break
      case tileTypes.GOAL:
      case tileTypes.FRAGILE_REDIRECTOR:
        this.dynamicTiles.set(tile as Tile)
        break
    }

    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  removeTile = (tilePos: Point) => {
    const existingBall = this.balls.find(
      (ball) => ball.tilePos.x === tilePos.x && ball.tilePos.y === tilePos.y,
    )
    if (existingBall) this.balls.splice(this.balls.indexOf(existingBall), 1)
    this.staticTiles.delete(tilePos)
    this.dynamicTiles.delete(tilePos)

    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  handlnteraction = (tilePos: Point, variant: number) => {
    const existing = this.staticTiles.get(tilePos) ?? this.dynamicTiles.get(tilePos)
    if (existing) {
      existing.onClick()
      return
    }

    if (this.balls.some((ball) => ball.tilePos.x === tilePos.x && ball.tilePos.y === tilePos.y))
      return

    this.dynamicTiles.set(new FragileRedirector(tilePos, variant))
  }

  render = () => {
    this.dynamicGraphics.draw()
  }
}

const wallsInRange = (range: WallRangeData): Wall[] => {
  const minX = Math.min(range.from.x, range.to.x)
  const maxX = Math.max(range.from.x, range.to.x)
  const minY = Math.min(range.from.y, range.to.y)
  const maxY = Math.max(range.from.y, range.to.y)

  const walls: Wall[] = []
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      walls.push(new Wall({ x, y }))
    }
  }
  return walls
}
