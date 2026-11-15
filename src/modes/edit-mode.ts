import { createLevel, saveLevel } from "../api"
import { gameStates } from "../game-state"
import { DEFAULT_DURATION } from "../level"
import { levelSequence } from "../level-sequence"
import { equals, Point } from "../lib/point"
import { statusPanel } from "../status-panel"
import { timer } from "../timer"
import { Mode, Navigate } from "./mode"
import { tileEditPanel } from "../ui/tile-edit-panel"
import { toolsPanel } from "../ui/tools-panel"
import { RangeController } from "../ui/elements/range-controller"
import { SaveIndicator } from "../ui/elements/save-indicator"
import { TextInput } from "../ui/elements/textinput"

const DURATION_STEP_COUNT = 7
const MIN_DURATION = 15
const DURATION_STEP = 15

const levelPanel = document.getElementById("level-panel")!
const saveButton = document.getElementById("save-button") as HTMLButtonElement
const closeButton = document.getElementById("close-button") as HTMLButtonElement

const levelNameInput = new TextInput("LEVEL NAME", 11, (value) => {
  levelSequence.current.data.name = value
})
const durationControl = new RangeController(
  "TIME",
  MIN_DURATION,
  DURATION_STEP,
  DURATION_STEP_COUNT,
  DEFAULT_DURATION,
  (duration) => {
    levelSequence.current.data.duration = duration
  },
)
const saveIndicator = new SaveIndicator()

levelPanel.prepend(levelNameInput.el, durationControl.el)
saveButton.before(saveIndicator.el)

class EditMode implements Mode {
  #savedSnapshot = ""
  #navigate: Navigate = async () => {}

  setNavigate = (navigate: Navigate) => {
    this.#navigate = navigate
  }

  enter = () => {
    const level = levelSequence.current

    level.reset()
    levelNameInput.value = level.data.name
    durationControl.value = level.data.duration
    this.#savedSnapshot = this.#snapshot()

    timer.clear()
    statusPanel.clear()
  }

  update = () => {
    levelSequence.current.purge()
    this.#updatePanels()
  }

  render = () => {
    levelSequence.current.render()
  }

  handleClick = (tilePos: Point, variant: number) => {
    const level = levelSequence.current
    const alreadyMarked = level.markedTilePos && equals(tilePos, level.markedTilePos)

    if (level.getTile(tilePos) && !alreadyMarked) {
      this.#markExistingTile(tilePos)
    } else {
      this.#applySelectedTool(tilePos, variant)
    }
  }

  save = async () => {
    const level = levelSequence.current
    const data = level.serialize()

    if (level.id === null) {
      level.id = await createLevel(data)
    } else {
      await saveLevel(level.id, data)
    }

    this.#savedSnapshot = JSON.stringify(data)
    saveIndicator.play()
  }

  close = () => {
    if (this.#snapshot() !== this.#savedSnapshot && !confirm("Close this level without saving?")) {
      return
    }

    this.#navigate(gameStates.EDIT_OVERVIEW)
  }

  #updatePanels = () => {
    toolsPanel.render()

    const level = levelSequence.current
    const markedTile = level.markedTilePos ? level.getTile(level.markedTilePos) : undefined
    const markedTool = markedTile ? toolsPanel.findToolByType(markedTile.type) : undefined

    tileEditPanel.setContent(markedTool ?? null, markedTile ?? null, level.redrawStatic)
  }

  #markExistingTile = (tilePos: Point) => {
    const level = levelSequence.current
    const existingTile = level.getTile(tilePos)!

    if (existingTile.type !== toolsPanel.selectedTool?.type) {
      toolsPanel.selectToolForType(existingTile.type)
    }

    level.markTile(tilePos)
  }

  #applySelectedTool = (tilePos: Point, variant: number) => {
    const level = levelSequence.current
    const existingTile = level.getTile(tilePos)
    const newTile = toolsPanel.executeSelectedTool(tilePos, variant, existingTile)

    if (newTile) {
      level.addTile(tilePos, newTile)
      level.markTile(tilePos)
    } else if (existingTile?.type === toolsPanel.selectedTool?.type) {
      level.removeTile(tilePos)
    }
  }

  #snapshot = () => JSON.stringify(levelSequence.current.serialize())
}

export const editMode = new EditMode()

saveButton.addEventListener("click", () => editMode.save())
closeButton.addEventListener("click", () => editMode.close())
