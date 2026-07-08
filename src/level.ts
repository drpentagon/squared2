import { Ball } from "./ball"
import { TileMap } from "./tiles/tile"
import { Wall } from "./tiles/wall"
import { Redirector } from "./tiles/redirector"
import { Goal } from "./tiles/goal"
import { BackgroundGraphics } from "./layers/background-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"

export type WallData = { x: number; y: number }
export type WallRangeData = { from: { x: number; y: number }; to: { x: number; y: number } }
export type RedirectorData = { x: number; y: number; variant: number }
export type GoalData = { x: number; y: number; direction: number; rotates?: boolean }
export type BallData = { x: number; y: number; vx: number; vy: number }

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
    this.staticTiles.addArray(this.data.walls.map((t) => new Wall(t.x, t.y)))
    this.staticTiles.addArray(this.data.wallRanges.flatMap(wallsInRange))
    this.staticTiles.addArray(
      this.data.permanentRedirects.map((t) => new Redirector(t.x, t.y, t.variant, true)),
    )

    this.dynamicTiles.clear()
    this.dynamicTiles.addArray(
      this.data.fragileRedirects.map((t) => new Redirector(t.x, t.y, t.variant, false)),
    )
    this.dynamicTiles.addArray(
      this.data.goals.map((t) => new Goal(t.x, t.y, t.direction, t.rotates)),
    )

    this.balls.splice(
      0,
      this.balls.length,
      ...this.data.balls.map((b) => new Ball(b.x, b.y, b.vx, b.vy)),
    )

    this.backgroundGraphics.clear()
    this.backgroundGraphics.draw()
    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  update = (dt: number) => {
    this.balls.forEach((ball) => {
      this.staticTiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
      this.dynamicTiles.get(ball.tilePosition.x, ball.tilePosition.y)?.interact(ball)
    })

    this.dynamicGraphics.update(dt)
  }

  handlnteraction = (tileX: number, tileY: number, variant: number) => {
    const existing = this.staticTiles.get(tileX, tileY) ?? this.dynamicTiles.get(tileX, tileY)
    if (existing) {
      existing.onClick()
      return
    }

    if (this.balls.some((ball) => ball.tilePosition.x === tileX && ball.tilePosition.y === tileY))
      return

    this.dynamicTiles.set(new Redirector(tileX, tileY, variant))
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
      walls.push(new Wall(x, y))
    }
  }
  return walls
}
