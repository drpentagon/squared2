import { fetchAllLevels } from "./api"
import { LevelOverview, NEW_LEVEL } from "./layers/level-overview"

type OverviewHandlers = {
  openLevel: (id: number, ids: number[]) => Promise<void>
  createLevel: () => void
}

let handlers: OverviewHandlers = {
  openLevel: async () => {},
  createLevel: () => {},
}

const levelOverview = new LevelOverview()

export const setOverviewHandlers = (next: OverviewHandlers) => {
  handlers = next
}

export const openOverview = async () => {
  const levels = await fetchAllLevels()
  const ids = levels.map((entry) => entry.id)

  const chosen = await levelOverview.show(levels)
  if (chosen === null) return

  if (chosen === NEW_LEVEL) {
    handlers.createLevel()
    return
  }

  await handlers.openLevel(chosen, ids)
}

export const isOverviewOpen = () => levelOverview.isOpen

export const dismissOverview = () => levelOverview.dismiss()
