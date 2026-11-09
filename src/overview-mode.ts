import { deleteLevel, fetchAllLevels, moveLevel } from "./api"
import { LevelOverview, OverviewClick } from "./layers/level-overview"
import { LevelEntry } from "./level"
import { LevelOverviewPanel } from "./ui/level-overview-panel"

type OpenLevel = (id: number, ids: number[]) => Promise<void>

type OverviewHandlers = {
  editLevel: OpenLevel
  playLevel: OpenLevel
  createLevel: () => void
}

let handlers: OverviewHandlers = {
  editLevel: async () => {},
  playLevel: async () => {},
  createLevel: () => {},
}

let levels: LevelEntry[] = []
let selectedId: number | null = null

const levelOverview = new LevelOverview()

const panel = new LevelOverviewPanel({
  edit: () => openSelected(handlers.editLevel),
  moveBack: () => move("back"),
  moveForward: () => move("forward"),
  play: () => openSelected(handlers.playLevel),
  remove: () => removeSelected(),
})

export const setOverviewHandlers = (next: OverviewHandlers) => {
  handlers = next
}

export const openOverview = async () => {
  await refresh()
  levelOverview.open(levels, handleClick)
}

export const isOverviewOpen = () => levelOverview.isOpen

export const dismissOverview = () => {
  select(null)
  levelOverview.close()
}

const handleClick = (click: OverviewClick) => {
  if (click.kind === "new") {
    dismissOverview()
    handlers.createLevel()
    return
  }

  if (click.kind === "level" && click.id === selectedId) {
    openSelected(handlers.editLevel)
    return
  }

  select(click.kind === "level" ? click.id : null)
}

const openSelected = async (open: OpenLevel) => {
  if (selectedId === null) return

  const id = selectedId
  const ids = levels.map((level) => level.id)
  dismissOverview()
  await open(id, ids)
}

const move = async (direction: "back" | "forward") => {
  if (selectedId === null) return

  await moveLevel(selectedId, direction)
  await refresh()
  select(selectedId)
}

const removeSelected = async () => {
  if (selectedId === null) return
  if (!confirm("Are you sure you want to delete this level?")) return

  await deleteLevel(selectedId)
  await refresh()
  select(null)
}

const select = (id: number | null) => {
  selectedId = id
  levelOverview.setSelected(id)

  const index = levels.findIndex((level) => level.id === id)
  if (index === -1) {
    panel.hide()
    return
  }

  panel.show(index > 0, index < levels.length - 1)
}

const refresh = async () => {
  levels = await fetchAllLevels()
  levelOverview.setLevels(levels)
}
