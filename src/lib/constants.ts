export const DOT_GRID_SIZE = 92
export const DOT_SIZE = 7
export const DOT_SPACING = 1
export const DOT_CC = DOT_SIZE + DOT_SPACING
export const TILES = 13
export const TILE_CC = 7 * DOT_CC
export const GRID_SIZE = DOT_GRID_SIZE * DOT_CC - DOT_SPACING
export const SQUARE_SIZE = 2 * DOT_SIZE + DOT_SPACING
export const SQUARE_STEP = 2 * DOT_CC
export const TILE_SIZE = 3 * SQUARE_SIZE + 2 * DOT_SPACING
export const BALL_SIZE = DOT_SIZE + DOT_CC
export const BALL_RADIUS = BALL_SIZE / 2
export const PANEL_WIDTH = 8 * DOT_CC - DOT_SPACING

console.log(TILE_SIZE)

export const directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
}
