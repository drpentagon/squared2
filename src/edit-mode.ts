import { createLevel, saveLevel } from "./api"
import { DEFAULT_DURATION, Level } from "./level"
import { equals, Point } from "./lib/point"
import { Mode } from "./mode"
import { tileEditPanel } from "./ui/tile-edit-panel"
import { toolsPanel } from "./ui/tools-panel"
import { RangeController } from "./ui/elements/range-controller"
import { SaveIndicator } from "./ui/elements/save-indicator"
import { TextInput } from "./ui/elements/textinput"

const DURATION_STEP_COUNT = 7
const MIN_DURATION = 15
const DURATION_STEP = 15

let currentLevel: Level
let savedSnapshot = ""
let onCloseLevel: () => void = () => {}

const levelPanel = document.getElementById("level-panel")!
const saveButton = document.getElementById("save-button") as HTMLButtonElement
const closeButton = document.getElementById("close-button") as HTMLButtonElement

const levelNameInput = new TextInput("LEVEL NAME", 11, (value) => {
  currentLevel.data.name = value
})
const durationControl = new RangeController(
  "TIME",
  MIN_DURATION,
  DURATION_STEP,
  DURATION_STEP_COUNT,
  DEFAULT_DURATION,
  (duration) => {
    currentLevel.data.duration = duration
  },
)
const saveIndicator = new SaveIndicator()

levelPanel.prepend(levelNameInput.el, durationControl.el)
saveButton.before(saveIndicator.el)

saveButton.addEventListener("click", () => saveCurrentLevel())
closeButton.addEventListener("click", () => closeCurrentLevel())

export const editMode: Mode = {
  setLevel: (level) => {
    currentLevel = level
    levelNameInput.value = level.data.name
    durationControl.value = level.data.duration
    savedSnapshot = snapshot()
  },

  update: () => {
    currentLevel.purge()
    updatePanels()
  },

  handleClick: (tilePos, variant) => {
    const alreadyMarked = currentLevel.markedTilePos && equals(tilePos, currentLevel.markedTilePos)

    if (currentLevel.getTile(tilePos) && !alreadyMarked) {
      markExistingTile(tilePos)
    } else {
      applySelectedTool(tilePos, variant)
    }
  },
}

const updatePanels = () => {
  toolsPanel.render()

  const markedTile = currentLevel.markedTilePos
    ? currentLevel.getTile(currentLevel.markedTilePos)
    : undefined
  const markedTool = markedTile ? toolsPanel.findToolByType(markedTile.type) : undefined
  tileEditPanel.setContent(markedTool ?? null, markedTile ?? null, currentLevel.redrawStatic)
}

const markExistingTile = (tilePos: Point) => {
  const existingTile = currentLevel.getTile(tilePos)!
  if (existingTile.type !== toolsPanel.selectedTool?.type) {
    toolsPanel.selectToolForType(existingTile.type)
  }
  currentLevel.markTile(tilePos)
}

const applySelectedTool = (tilePos: Point, variant: number) => {
  const existingTile = currentLevel.getTile(tilePos)
  const newTile = toolsPanel.executeSelectedTool(tilePos, variant, existingTile)

  if (newTile) {
    currentLevel.addTile(tilePos, newTile)
    currentLevel.markTile(tilePos)
  } else if (existingTile?.type === toolsPanel.selectedTool?.type) {
    currentLevel.removeTile(tilePos)
  }
}

export const saveCurrentLevel = async () => {
  const data = currentLevel.serialize()
  if (currentLevel.id === null) {
    currentLevel.id = await createLevel(data)
  } else {
    await saveLevel(currentLevel.id, data)
  }

  savedSnapshot = JSON.stringify(data)
  saveIndicator.play()
}

const closeCurrentLevel = () => {
  if (snapshot() !== savedSnapshot && !confirm("Close this level without saving?")) return

  onCloseLevel()
}

const snapshot = () => JSON.stringify(currentLevel.serialize())

export const setOnCloseLevel = (handler: () => void) => {
  onCloseLevel = handler
}
