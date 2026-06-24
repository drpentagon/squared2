import { TILE_SIZE } from "../constants"

const ROTATIONS: ((x: number, y: number) => [number, number])[] = [
  (x, y) => [x, y],
  (x, y) => [TILE_SIZE - y, x],
  (x, y) => [TILE_SIZE - x, TILE_SIZE - y],
  (x, y) => [y, TILE_SIZE - x],
]

export const rotatePolygon = (points: [number, number][], steps: number): [number, number][] => {
  const rotate = ROTATIONS[steps % 4]
  return points.map(([x, y]) => rotate(x, y))
}
