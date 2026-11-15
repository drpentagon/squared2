import { clock } from "../clock"
import { gameStates } from "../game-state"
import { dialogueLayer } from "../layers/dialogue-layer"
import { levelSequence } from "../level-sequence"
import { Point } from "../lib/point"
import { statusPanel } from "../status-panel"
import { timer } from "../timer"
import { Mode, Navigate } from "./mode"

class GameMode implements Mode {
  #navigate: Navigate = async () => {}

  setNavigate = (navigate: Navigate) => {
    this.#navigate = navigate
  }

  enter = () => {
    levelSequence.current.reset()
    timer.start(levelSequence.current.data.duration, this.#onTimeExpired)
  }

  update = async (dt: number) => {
    const level = levelSequence.current

    level.update(dt)
    timer.update(dt)

    if (!level.finished) return

    const next = await levelSequence.fetchNext()
    await dialogueLayer.levelClear(
      timer.elapsed,
      level.bounces,
      level.redirectsPlaced,
      0,
      next?.data.name ?? null,
    )

    if (!next) {
      await this.#navigate(gameStates.EDIT_OVERVIEW)
      return
    }

    levelSequence.install(next)
    this.enter()
    clock.resync()
  }

  render = () => {
    levelSequence.current.render()
    timer.draw()
    statusPanel.draw()
  }

  handleClick = (tilePos: Point, variant: number) => {
    levelSequence.current.handlnteraction(tilePos, variant)
  }

  #onTimeExpired = async () => {
    if (levelSequence.current.finished) return

    await dialogueLayer.lostSquare()
    this.enter()
    clock.resync()
  }
}

export const gameMode = new GameMode()
