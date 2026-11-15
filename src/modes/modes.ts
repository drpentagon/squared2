import { gameState, gameStates, StateName } from "../game-state"
import { dialogueMode } from "./dialogue-mode"
import { editMode } from "./edit-mode"
import { gameMode } from "./game-mode"
import { Mode } from "./mode"
import { overviewMode } from "./overview-mode"

const MODE_BY_STATE: Record<StateName, Mode> = {
  [gameStates.GAME]: gameMode,
  [gameStates.EDIT_LEVEL]: editMode,
  [gameStates.EDIT_OVERVIEW]: overviewMode,
  [gameStates.DIALOGUE]: dialogueMode,
}

export const currentMode = () => MODE_BY_STATE[gameState.current]

export const enterMode = async (state: StateName) => {
  gameState.set(state)
  await MODE_BY_STATE[state].enter()
}
