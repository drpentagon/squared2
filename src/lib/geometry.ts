import { TILE_SIZE, directions } from "./constants"

const ROTATIONS: ((x: number, y: number) => [number, number])[] = [
  (x, y) => [x, y],
  (x, y) => [TILE_SIZE - y, x],
  (x, y) => [TILE_SIZE - x, TILE_SIZE - y],
  (x, y) => [y, TILE_SIZE - x],
]

export const DIRECTION_STEPS = [directions.UP, directions.RIGHT, directions.DOWN, directions.LEFT]

export const rotatePolygon = (
  points: [number, number][],
  steps: number | string,
): [number, number][] => {
  const n = typeof steps === "string" ? DIRECTION_STEPS.indexOf(steps) : steps
  const rotate = ROTATIONS[n % 4]
  return points.map(([x, y]) => rotate(x, y))
}
