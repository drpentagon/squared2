import { fetchLevel, fetchLevelIds } from "./api"
import { emptyLevelData, Level, LevelData } from "./level"

export type LoadedLevel = { index: number; id: number; data: LevelData }

class LevelSequence {
  #ids: number[] = []
  #index: number | null = null
  #level: Level | null = null

  get current() {
    return this.#level!
  }

  redraw = () => {
    this.#level?.redraw()
  }

  loadFirst = async () => {
    this.#ids = await fetchLevelIds()

    const first = await this.fetchNext()
    if (!first) return false

    this.install(first)
    return true
  }

  fetchNext = async (): Promise<LoadedLevel | null> => {
    const index = this.#index === null ? 0 : this.#index + 1
    const id = this.#ids[index]

    if (id === undefined) return null

    return { index, id, data: await fetchLevel(id) }
  }

  install = ({ index, id, data }: LoadedLevel) => {
    this.#index = index
    this.#level?.destroy()
    this.#level = new Level(id, data)
  }

  load = async (id: number, ids: number[]) => {
    this.#ids = ids
    this.install({ index: ids.indexOf(id), id, data: await fetchLevel(id) })
  }

  createNew = () => {
    this.#level?.destroy()
    this.#level = new Level(null, emptyLevelData())
  }
}

export const levelSequence = new LevelSequence()
