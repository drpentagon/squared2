export type Point = { x: number; y: number }

export const equals = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y
