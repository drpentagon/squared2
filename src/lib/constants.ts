const DOT_GRID_SIZE = 92
const DOT_SIZE = 7
const DOT_SPACING = 1
const DOT_CC = DOT_SIZE + DOT_SPACING

const TILE_COUNT = 13
const TILE_CC = 7 * DOT_CC

const SQUARE_SIZE = 2 * DOT_SIZE + DOT_SPACING
const SQUARE_STEP = 2 * DOT_CC

const TILE_SIZE = 3 * SQUARE_SIZE + 2 * DOT_SPACING
const TILE_SPACING = TILE_CC - TILE_SIZE

const GRID_SIZE = DOT_GRID_SIZE * DOT_CC - DOT_SPACING

const BALL_SIZE = DOT_SIZE + DOT_CC
const BALL_RADIUS = BALL_SIZE / 2

const PANEL_WIDTH = 8 * DOT_CC - DOT_SPACING
const TOOL_SIZE = PANEL_WIDTH
const TOOL_STEP = TOOL_SIZE + DOT_SPACING

export const DOT = { GRID_SIZE: DOT_GRID_SIZE, SIZE: DOT_SIZE, SPACING: DOT_SPACING, CC: DOT_CC }
export const TILE = { COUNT: TILE_COUNT, CC: TILE_CC, SIZE: TILE_SIZE, SPACING: TILE_SPACING }
export const GRID = { SIZE: GRID_SIZE }
export const SQUARE = { SIZE: SQUARE_SIZE, STEP: SQUARE_STEP }
export const BALL = { SIZE: BALL_SIZE, RADIUS: BALL_RADIUS }
export const PANEL = { WIDTH: PANEL_WIDTH }
export const TOOL = { SIZE: TOOL_SIZE, STEP: TOOL_STEP }

export const directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
}

export const DIRECTIONS = [directions.UP, directions.RIGHT, directions.DOWN, directions.LEFT]

export const OPPOSITE_DIRECTION: Record<string, string> = {
  [directions.UP]: directions.DOWN,
  [directions.DOWN]: directions.UP,
  [directions.LEFT]: directions.RIGHT,
  [directions.RIGHT]: directions.LEFT,
}

export const NEXT_DIRECTION: Record<string, string> = {
  [directions.UP]: directions.RIGHT,
  [directions.RIGHT]: directions.DOWN,
  [directions.DOWN]: directions.LEFT,
  [directions.LEFT]: directions.UP,
}

export const PREVIOUS_DIRECTION: Record<string, string> = {
  [directions.UP]: directions.LEFT,
  [directions.RIGHT]: directions.UP,
  [directions.DOWN]: directions.RIGHT,
  [directions.LEFT]: directions.DOWN,
}

export const tileTypes = {
  WALL: "WALL",
  REDIRECTOR: "REDIRECTOR",
  FRAGILE_REDIRECTOR: "FRAGILE_REDIRECTOR",
  GOAL: "GOAL",
  BALL: "BALL",
}
