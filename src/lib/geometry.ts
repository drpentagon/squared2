import { DIRECTIONS, MINIATURE, TILE } from "./constants"
import { Point } from "./point"

const ROTATIONS: ((x: number, y: number, center: Point) => [number, number])[] = [
  (x, y) => [x, y],
  (x, y, c) => [c.x + c.y - y, x - c.x + c.y],
  (x, y, c) => [2 * c.x - x, 2 * c.y - y],
  (x, y, c) => [c.x - c.y + y, c.x + c.y - x],
]

const TILE_CENTER: Point = { x: TILE.SIZE / 2, y: TILE.SIZE / 2 }

export const shapeRotations = (shape: [number, number][]) => ({
  full: byDirection((direction) => rotatePolygon(shape, direction)),
  miniature: byDirection((direction) =>
    scalePolygon(rotatePolygon(shape, direction), MINIATURE.SCALE),
  ),
})

export const rotatePolygon = (
  points: [number, number][],
  direction: string,
  center: Point = TILE_CENTER,
): [number, number][] => {
  const n = DIRECTIONS.indexOf(direction)
  const rotate = ROTATIONS[((n % 4) + 4) % 4]
  return points.map(([x, y]) => rotate(x, y, center))
}

const byDirection = <T>(build: (direction: string) => T): Record<string, T> =>
  Object.fromEntries(DIRECTIONS.map((direction) => [direction, build(direction)]))

const scalePolygon = (points: [number, number][], factor: number): [number, number][] =>
  points.map(([x, y]) => [Math.round(x * factor), Math.round(y * factor)])
