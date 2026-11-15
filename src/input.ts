import { gameState, gameStates } from "./game-state"
import { origin } from "./grid"
import { DOT, GRID, TILE } from "./lib/constants"
import { Point } from "./lib/point"
import { currentMode, enterMode } from "./modes/modes"
import { pixelToTile } from "./tiles/tile"

const OPEN_OVERVIEW_CLICKS = 3

const VARIANT_BY_QUADRANT = [
  [0, 1],
  [3, 2],
] as const

export const listenForClicks = () => {
  document.addEventListener("click", handleClick)
}

const handleClick = (e: MouseEvent) => {
  const local: Point = { x: e.clientX - origin.x, y: e.clientY - origin.y }

  if (local.x < 0 || local.x >= GRID.SIZE || local.y < 0 || local.y >= GRID.SIZE) {
    if (e.detail === OPEN_OVERVIEW_CLICKS && gameState.playing()) {
      enterMode(gameStates.EDIT_OVERVIEW)
    }
    return
  }

  const tilePos = pixelToTile(local)

  const tileOrigin: Point = {
    x: DOT.CC + tilePos.x * TILE.CC,
    y: DOT.CC + tilePos.y * TILE.CC,
  }
  const col = local.x - tileOrigin.x >= TILE.SIZE / 2 ? 1 : 0
  const row = local.y - tileOrigin.y >= TILE.SIZE / 2 ? 1 : 0

  currentMode().handleClick(tilePos, VARIANT_BY_QUADRANT[row][col])
}
