import { Ball } from "./ball"
import { GameObjects } from "./game-objects"
import { GridObject } from "./grid-object"
import { BackgroundGraphics } from "./layers/background-graphics"
import { DynamicGraphics } from "./layers/dynamic-graphics"
import { SelectionGraphics } from "./layers/selection-graphics"
import { StaticGraphics } from "./layers/static-graphics"
import { DIRECTIONS, tileTypes } from "./lib/constants"
import { equals, Point } from "./lib/point"
import { FragileRedirector } from "./tiles/fragile-redirector"
import { Goal } from "./tiles/goal"
import { Redirector } from "./tiles/redirector"
import { Wall } from "./tiles/wall"

export type WallData = Point
export type WallRangeData = { from: Point; to: Point }
export type RedirectorData = Point & { variant: number }
export type GoalData = Point & { direction: number; rotates?: boolean }
export type BallData = Point & { direction: string; velocity: number }

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
  gameObjects: GameObjects
  finished: boolean
  bounces: number
  elapsedTime: number
  redirectsPlaced: number
  markedTilePos: Point | null

  backgroundGraphics: BackgroundGraphics
  selectionGraphics: SelectionGraphics
  staticGraphics: StaticGraphics
  dynamicGraphics: DynamicGraphics

  constructor(data: LevelData) {
    this.data = data
    this.gameObjects = new GameObjects()
    this.finished = false
    this.bounces = 0
    this.elapsedTime = 0
    this.redirectsPlaced = 0
    this.markedTilePos = null

    this.backgroundGraphics = new BackgroundGraphics()
    this.selectionGraphics = new SelectionGraphics()
    this.staticGraphics = new StaticGraphics(this.gameObjects.staticTiles)
    this.reset()
    this.dynamicGraphics = new DynamicGraphics(
      this.gameObjects.dynamicTiles,
      this.gameObjects.balls,
    )
  }

  reset = () => {
    this.gameObjects.staticTiles.clear()
    this.gameObjects.staticTiles.addArray(this.data.walls.map((t) => new Wall(t)))
    this.gameObjects.staticTiles.addArray(this.data.wallRanges.flatMap(wallsInRange))
    this.gameObjects.staticTiles.addArray(
      this.data.permanentRedirects.map((t) => new Redirector(t, DIRECTIONS[t.variant])),
    )

    this.gameObjects.dynamicTiles.clear()
    this.gameObjects.dynamicTiles.addArray(
      this.data.fragileRedirects.map((t) => new FragileRedirector(t, DIRECTIONS[t.variant])),
    )
    this.gameObjects.dynamicTiles.addArray(
      this.data.goals.map((t) => new Goal(t, DIRECTIONS[t.direction], t.rotates)),
    )

    this.gameObjects.balls.splice(
      0,
      this.gameObjects.balls.length,
      ...this.data.balls.map((b) => new Ball(b, b.velocity, b.direction)),
    )

    this.markedTilePos = null

    this.backgroundGraphics.clear()
    this.backgroundGraphics.draw()
    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  update = (dt: number) => {
    this.elapsedTime += dt

    this.gameObjects.balls.forEach((ball) => {
      const directionBefore = ball.direction
      this.gameObjects.staticTiles.get(ball.tilePos)?.interact(ball)
      this.gameObjects.dynamicTiles.get(ball.tilePos)?.interact(ball)
      if (ball.direction !== directionBefore) this.bounces++
    })

    this.purge()
    this.finished = this.gameObjects.balls.length === 0
    this.dynamicGraphics.update(dt)
  }

  purge = () => {
    if (this.gameObjects.purge()) {
      this.staticGraphics.clear()
      this.staticGraphics.draw()
    }

    if (this.markedTilePos && !this.gameObjects.get(this.markedTilePos)) {
      this.markedTilePos = null
    }
  }

  getTile = (tilePos: Point): GridObject | undefined => this.gameObjects.get(tilePos)

  addTile = (tilePos: Point, tile: GridObject) => {
    if (!tile) return
    if (!this.gameObjects.add(tilePos, tile)) return

    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  removeTile = (tilePos: Point) => {
    this.gameObjects.remove(tilePos)

    this.markedTilePos = null

    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  markTile = (tilePos: Point | null) => {
    this.markedTilePos = tilePos
  }

  clear = () => {
    this.gameObjects.clear()

    this.staticGraphics.clear()
    this.staticGraphics.draw()
  }

  handlnteraction = (tilePos: Point, variant: number) => {
    const existing =
      this.gameObjects.staticTiles.get(tilePos) ?? this.gameObjects.dynamicTiles.get(tilePos)
    if (existing) {
      existing.onClick()
      return
    }

    if (this.gameObjects.balls.some((ball) => equals(ball.tilePos, tilePos))) return

    this.gameObjects.dynamicTiles.set(new FragileRedirector(tilePos, DIRECTIONS[variant]))
    this.redirectsPlaced++
  }

  render = (editing = false) => {
    this.selectionGraphics.draw(editing ? this.markedTilePos : null)
    this.dynamicGraphics.draw(editing)
  }

  destroy = () => {
    this.backgroundGraphics.destroy()
    this.selectionGraphics.destroy()
    this.staticGraphics.destroy()
    this.dynamicGraphics.destroy()
  }

  serialize = (): LevelData => {
    const wallPositions: Point[] = []
    const permanentRedirects: RedirectorData[] = []
    this.gameObjects.staticTiles.forEach((tile) => {
      if (tile.type === tileTypes.WALL) {
        wallPositions.push({ x: tile.tilePos.x, y: tile.tilePos.y })
      } else if (tile.type === tileTypes.REDIRECTOR) {
        const redirector = tile as Redirector
        permanentRedirects.push({
          x: tile.tilePos.x,
          y: tile.tilePos.y,
          variant: DIRECTIONS.indexOf(redirector.direction),
        })
      }
    })

    const fragileRedirects: RedirectorData[] = []
    const goals: GoalData[] = []
    this.gameObjects.dynamicTiles.forEach((tile) => {
      if (tile.type === tileTypes.FRAGILE_REDIRECTOR) {
        const redirector = tile as FragileRedirector
        fragileRedirects.push({
          x: tile.tilePos.x,
          y: tile.tilePos.y,
          variant: DIRECTIONS.indexOf(redirector.direction),
        })
      } else if (tile.type === tileTypes.GOAL) {
        const goal = tile as Goal
        goals.push({
          x: tile.tilePos.x,
          y: tile.tilePos.y,
          direction: DIRECTIONS.indexOf(goal.direction),
          rotates: goal.rotates,
        })
      }
    })

    const balls: BallData[] = this.gameObjects.balls.map((ball) => ({
      x: ball.tilePos.x,
      y: ball.tilePos.y,
      direction: ball.direction,
      velocity: ball.velocity,
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
