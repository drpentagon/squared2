export const gameStates = {
  GAME: "game",
  EDIT_OVERVIEW: "edit-overview",
  EDIT_LEVEL: "edit-level",
  DIALOGUE: "dialogue",
}

export type StateName = (typeof gameStates)[keyof typeof gameStates]

const STATES = Object.values(gameStates)

class GameState {
  #current: StateName = gameStates.GAME

  get current() {
    return this.#current
  }

  set = (state: StateName) => {
    this.#current = state
    document.body.classList.remove(...STATES)
    document.body.classList.add(state)
  }

  running = () => this.playing() || this.editing()

  playing = () => this.#current === gameStates.GAME

  editing = () => this.#current === gameStates.EDIT_LEVEL

  inDialogue = () => this.#current === gameStates.DIALOGUE
}

export const gameState = new GameState()
