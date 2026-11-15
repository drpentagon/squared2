import { gameStates } from "./game-state"
import { listenForClicks } from "./input"
import { dialogueLayer } from "./layers/dialogue-layer"
import { levelSequence } from "./level-sequence"
import { startLoop } from "./loop"
import { editMode } from "./modes/edit-mode"
import { gameMode } from "./modes/game-mode"
import { enterMode } from "./modes/modes"
import { overviewMode } from "./modes/overview-mode"

gameMode.setNavigate(enterMode)
editMode.setNavigate(enterMode)
overviewMode.setNavigate(enterMode)

const start = async () => {
  try {
    const loaded = await levelSequence.loadFirst()
    await enterMode(loaded ? gameStates.GAME : gameStates.EDIT_OVERVIEW)
    dialogueLayer.title()
  } catch (error) {
    console.error(error)
    dialogueLayer.noConnection()
  }

  listenForClicks()
  startLoop()
}

start()
