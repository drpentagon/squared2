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
  finished: boolean
  bounces: number
  elapsedTime: number
  redirectsPlaced: number

  backgroundGraphics: BackgroundGraphics
  staticGraphics: StaticGraphics
  dynamicGraphics: DynamicGraphics

  constructor(data: LevelData) {
    this.data = data
    this.staticTiles = new TileMap()
    this.dynamicTiles = new TileMap()
    this.balls = []
    this.finished = false
    this.bounces = 0
    this.elapsedTime = 0
    this.redirectsPlaced = 0

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
    this.elapsedTime += dt

    this.balls.forEach((ball) => {
      const directionBefore = ball.direction()
      this.staticTiles.get(ball.tilePos)?.interact(ball)
      this.dynamicTiles.get(ball.tilePos)?.interact(ball)
      if (ball.direction() !== directionBefore) this.bounces++
    })

    this.finished = this.dynamicGraphics.purge()
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

  clear = () => {
    this.staticTiles.clear()
    this.dynamicTiles.clear()
    this.balls.splice(0, this.balls.length)

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
    this.redirectsPlaced++
  }

  render = () => {
    this.dynamicGraphics.draw()
  }

  destroy = () => {
    this.backgroundGraphics.destroy()
    this.staticGraphics.destroy()
    this.dynamicGraphics.destroy()
  }

  serialize = (): LevelData => {
    const wallPositions: Point[] = []
    const permanentRedirects: RedirectorData[] = []
    this.staticTiles.forEach((tile) => {
      if (tile.type === tileTypes.WALL) {
        wallPositions.push({ x: tile.tilePos.x, y: tile.tilePos.y })
      } else if (tile.type === tileTypes.REDIRECTOR) {
        const redirector = tile as Redirector
        permanentRedirects.push({
          x: tile.tilePos.x,
          y: tile.tilePos.y,
          variant: redirector.variant,
        })
      }
    })

    const fragileRedirects: RedirectorData[] = []
    const goals: GoalData[] = []
    this.dynamicTiles.forEach((tile) => {
      if (tile.type === tileTypes.FRAGILE_REDIRECTOR) {
        const redirector = tile as FragileRedirector
        fragileRedirects.push({ x: tile.tilePos.x, y: tile.tilePos.y, variant: redirector.variant })
      } else if (tile.type === tileTypes.GOAL) {
        const goal = tile as Goal
        goals.push({
          x: tile.tilePos.x,
          y: tile.tilePos.y,
          direction: goal.direction,
          rotates: goal.rotates,
        })
      }
    })

    const balls: BallData[] = this.balls.map((ball) => ({
      x: ball.tilePos.x,
      y: ball.tilePos.y,
      vx: ball.vx,
      vy: ball.vy,
    }))

    const { walls, wallRanges } = groupWallsIntoRanges(wallPositions)

    return { walls, wallRanges, fragileRedirects, permanentRedirects, goals, balls }
  }
}

const groupWallsIntoRanges = (
  positions: Point[],
): { walls: WallData[]; wallRanges: WallRangeData[] } => {
  const key = (x: number, y: number) => `${x},${y}`
  const remaining = new Set(positions.map((p) => key(p.x, p.y)))

  const walls: WallData[] = []
  const wallRanges: WallRangeData[] = []

  const sorted = [...positions].sort((a, b) => a.y - b.y || a.x - b.x)

  for (const { x, y } of sorted) {
    if (!remaining.has(key(x, y))) continue

    let width = 1
    while (remaining.has(key(x + width, y))) width++

    let height = 1
    heightLoop: while (true) {
      for (let dx = 0; dx < width; dx++) {
        if (!remaining.has(key(x + dx, y + height))) break heightLoop
      }
      height++
    }

    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        remaining.delete(key(x + dx, y + dy))
      }
    }

    if (width === 1 && height === 1) {
      walls.push({ x, y })
    } else {
      wallRanges.push({ from: { x, y }, to: { x: x + width - 1, y: y + height - 1 } })
    }
  }

  return { walls, wallRanges }
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
