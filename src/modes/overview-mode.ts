import { deleteLevel, fetchAllLevels, moveLevel } from "../api"
import { gameStates, StateName } from "../game-state"
import { dialogueLayer } from "../layers/dialogue-layer"
import { LevelOverview, OverviewClick } from "../layers/level-overview"
import { LevelEntry } from "../level"
import { levelSequence } from "../level-sequence"
import { Mode, Navigate } from "./mode"
import { LevelOverviewPanel } from "../ui/level-overview-panel"

const levelOverview = new LevelOverview()

const panel = new LevelOverviewPanel({
  edit: () => overviewMode.openSelected(gameStates.EDIT_LEVEL),
  moveBack: () => overviewMode.move("back"),
  moveForward: () => overviewMode.move("forward"),
  play: () => overviewMode.openSelected(gameStates.GAME),
  remove: () => overviewMode.removeSelected(),
})

class OverviewMode implements Mode {
  #levels: LevelEntry[] = []
  #selectedId: number | null = null
  #navigate: Navigate = async () => {}

  setNavigate = (navigate: Navigate) => {
    this.#navigate = navigate
  }

  enter = async () => {
    dialogueLayer.dismiss()
    await this.#refresh()
    levelOverview.open(this.#levels, this.#handleOverviewClick)
  }

  update = () => {}

  render = () => {}

  handleClick = () => {}

  openSelected = async (state: StateName) => {
    if (this.#selectedId === null) return

    const id = this.#selectedId
    const ids = this.#levels.map((level) => level.id)

    this.#dismiss()
    await levelSequence.load(id, ids)
    await this.#navigate(state)
  }

  move = async (direction: "back" | "forward") => {
    if (this.#selectedId === null) return

    await moveLevel(this.#selectedId, direction)
    await this.#refresh()
    this.#select(this.#selectedId)
  }

  removeSelected = async () => {
    if (this.#selectedId === null) return
    if (!confirm("Are you sure you want to delete this level?")) return

    await deleteLevel(this.#selectedId)
    await this.#refresh()
    this.#select(null)
  }

  #handleOverviewClick = (click: OverviewClick) => {
    if (click.kind === "new") {
      this.#dismiss()
      levelSequence.createNew()
      this.#navigate(gameStates.EDIT_LEVEL)
      return
    }

    if (click.kind === "level" && click.id === this.#selectedId) {
      this.openSelected(gameStates.EDIT_LEVEL)
      return
    }

    this.#select(click.kind === "level" ? click.id : null)
  }

  #dismiss = () => {
    this.#select(null)
    levelOverview.close()
  }

  #select = (id: number | null) => {
    this.#selectedId = id
    levelOverview.setSelected(id)

    const index = this.#levels.findIndex((level) => level.id === id)
    if (index === -1) {
      panel.hide()
      return
    }

    panel.show(index > 0, index < this.#levels.length - 1)
  }

  #refresh = async () => {
    this.#levels = await fetchAllLevels()
    levelOverview.setLevels(this.#levels)
  }
}

export const overviewMode = new OverviewMode()
