import { DIRECTIONS, TILE } from "./constants"
import { Point } from "./point"

const ROTATIONS: ((x: number, y: number, center: Point) => [number, number])[] = [
  (x, y) => [x, y],
  (x, y, c) => [c.x + c.y - y, x - c.x + c.y],
  (x, y, c) => [2 * c.x - x, 2 * c.y - y],
  (x, y, c) => [c.x - c.y + y, c.x + c.y - x],
]

const TILE_CENTER: Point = { x: TILE.SIZE / 2, y: TILE.SIZE / 2 }

export const rotatePolygon = (
  points: [number, number][],
  direction: string,
  center: Point = TILE_CENTER,
): [number, number][] => {
  const n = DIRECTIONS.indexOf(direction)
  const rotate = ROTATIONS[((n % 4) + 4) % 4]
  return points.map(([x, y]) => rotate(x, y, center))
}
