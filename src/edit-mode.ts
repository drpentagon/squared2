import { Level } from "./level"
import { equals } from "./lib/point"
import { Mode } from "./mode"
import { tileEditPanel } from "./ui/tile-edit-panel"
import { toolsPanel } from "./ui/tools-panel"
import { TextInput } from "./ui/elements/textinput"

let currentLevel: Level

const levelPanel = document.getElementById("level-panel")!
const levelNameInput = new TextInput("LEVEL NAME", 11, (value) => {
  currentLevel.data.name = value
})
levelPanel.prepend(levelNameInput.el)

const copyButton = document.getElementById("copy-button") as HTMLButtonElement
const copyButtonLabel = copyButton.querySelector<HTMLElement>(".edit-panel-button-label")!

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(JSON.stringify(currentLevel.serialize(), null, 2))
  const originalText = copyButtonLabel.textContent
  copyButtonLabel.textContent = "Kopierad!"
  setTimeout(() => {
    copyButtonLabel.textContent = originalText
  }, 1500)
})

const clearLevelButton = document.getElementById("clear-level-button") as HTMLButtonElement

clearLevelButton.addEventListener("click", () => {
  if (!confirm("Are you sure you want to clear the level?")) return

  currentLevel.clear()
  currentLevel.data.name = ""
  levelNameInput.value = ""
})

export const editMode: Mode = {
  setLevel: (level) => {
    currentLevel = level
    levelNameInput.value = level.data.name
  },

  update: () => {
    toolsPanel.render()
    currentLevel.purge()

    const markedTile = currentLevel.markedTilePos
      ? currentLevel.getTile(currentLevel.markedTilePos)
      : undefined
    const markedTool = markedTile ? toolsPanel.findToolByType(markedTile.type) : undefined
    tileEditPanel.setContent(markedTool ?? null, markedTile ?? null)
  },

  handleClick: (tilePos, variant) => {
    const existingTile = currentLevel.getTile(tilePos)
    const alreadyMarked = currentLevel.markedTilePos && equals(tilePos, currentLevel.markedTilePos)
    if (existingTile && !alreadyMarked) {
      if (existingTile.type !== toolsPanel.selectedTool?.type) {
        toolsPanel.selectToolForType(existingTile.type)
      }
      currentLevel.markTile(tilePos)
      return
    }

    const newTile = toolsPanel.executeSelectedTool(tilePos, variant, existingTile)
    switch (true) {
      case existingTile?.type === toolsPanel.selectedTool?.type && !newTile:
        currentLevel.removeTile(tilePos)
        break
      case !newTile:
        return
      default:
        currentLevel.addTile(tilePos, newTile)
        currentLevel.markTile(tilePos)
    }
  },
}
