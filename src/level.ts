import { Ball } from "./ball"
import { TileMap } from "./tiles/tile"
import { Wall } from "./tiles/wall"
import { Redirector } from "./tiles/redirector"
import { Goal } from "./tiles/goal"

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

export class Level {
  staticTiles: TileMap
  dynamicTiles: TileMap
  balls: Ball[]

  constructor(data: LevelData) {
    this.staticTiles = new TileMap()
    this.staticTiles.addArray(data.walls.map((t) => new Wall(t.x, t.y)))
    this.staticTiles.addArray(data.wallRanges.flatMap(wallsInRange))
    this.staticTiles.addArray(
      data.permanentRedirects.map((t) => new Redirector(t.x, t.y, t.variant, true)),
    )

    this.dynamicTiles = new TileMap()
    this.dynamicTiles.addArray(
      data.fragileRedirects.map((t) => new Redirector(t.x, t.y, t.variant, false)),
    )
    this.dynamicTiles.addArray(data.goals.map((t) => new Goal(t.x, t.y, t.direction, t.rotates)))

    this.balls = data.balls.map((b) => new Ball(b.x, b.y, b.vx, b.vy))
  }
}
