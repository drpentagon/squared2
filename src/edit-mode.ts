import { createLevel, saveLevel } from "./api"
import { Level } from "./level"
import { equals, Point } from "./lib/point"
import { Mode } from "./mode"
import { tileEditPanel } from "./ui/tile-edit-panel"
import { toolsPanel } from "./ui/tools-panel"
import { SaveIndicator } from "./ui/elements/save-indicator"
import { TextInput } from "./ui/elements/textinput"

let currentLevel: Level
let savedSnapshot = ""
let onCloseLevel: () => void = () => {}

const levelPanel = document.getElementById("level-panel")!
const saveButton = document.getElementById("save-button") as HTMLButtonElement
const clearLevelButton = document.getElementById("clear-level-button") as HTMLButtonElement
const closeButton = document.getElementById("close-button") as HTMLButtonElement

const levelNameInput = new TextInput("LEVEL NAME", 11, (value) => {
  currentLevel.data.name = value
})
const saveIndicator = new SaveIndicator()

levelPanel.prepend(levelNameInput.el)
saveButton.before(saveIndicator.el)

saveButton.addEventListener("click", () => saveCurrentLevel())
clearLevelButton.addEventListener("click", () => clearCurrentLevel())
closeButton.addEventListener("click", () => closeCurrentLevel())

export const editMode: Mode = {
  setLevel: (level) => {
    currentLevel = level
    levelNameInput.value = level.data.name
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

const clearCurrentLevel = () => {
  if (!confirm("Are you sure you want to clear the level?")) return

  currentLevel.clear()
  currentLevel.data.name = ""
  levelNameInput.value = ""
}

const closeCurrentLevel = () => {
  if (snapshot() !== savedSnapshot && !confirm("Close this level without saving?")) return

  onCloseLevel()
}

const snapshot = () => JSON.stringify(currentLevel.serialize())

export const setOnCloseLevel = (handler: () => void) => {
  onCloseLevel = handler
}
