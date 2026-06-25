export const DOT_GRID_SIZE = 92
export const DOT_SIZE = 7
export const DOT_SPACING = 1
export const DOT_CC = DOT_SIZE + DOT_SPACING
export const TILES = 13
export const TILE_DOTS = 6
export const TILE_CC = (TILE_DOTS + 1) * DOT_CC
export const GRID_SIZE = DOT_GRID_SIZE * DOT_CC - DOT_SPACING
export const SQUARE_SIZE = 2 * DOT_SIZE + DOT_SPACING
export const SQUARE_STEP = 2 * DOT_CC
export const TILE_SIZE = 3 * SQUARE_SIZE + 2 * DOT_SPACING

export const directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
}
