import { fetchLevel, fetchLevelIds } from "./api"
import { gameMode } from "./game-mode"
import { editMode, setOnCloseLevel } from "./edit-mode"
import { origin } from "./grid"
import { emptyLevelData, Level, LevelData } from "./level"
import { DialogueLayer } from "./layers/dialogue-layer"
import { DOT, GRID, TILE } from "./lib/constants"
import { Point } from "./lib/point"
import { Mode } from "./mode"
import { openOverview, setOverviewHandlers } from "./overview-mode"
import { pixelToTile } from "./tiles/tile"
import { timer } from "./timer"
import { setViewState, ViewState } from "./view-state"

let levelIds: number[] = []
let currentLevelIndex: number | null = null
let level: Level
let lastTime = 0
let viewState: ViewState = "game"

type LoadedLevel = { index: number; id: number; data: LevelData }

const editing = () => viewState === "edit-level"

const currentMode = (): Mode => (editing() ? editMode : gameMode)

const dialogueLayer = new DialogueLayer()

const loop = async (timestamp: number) => {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  try {
    if (viewState !== "edit-overview" && !dialogueLayer.isOpen) {
      currentMode().update(dt)

      if (viewState === "game") {
        timer.update(dt)

        if (level.finished) {
          timer.draw(false)
          const next = await fetchNextLevel()
          await dialogueLayer.levelClear(
            timer.elapsed,
            level.bounces,
            level.redirectsPlaced,
            0,
            next?.data.name ?? null,
          )
          if (next) installLevel(next)
          else await showOverview()
          lastTime = performance.now()
        }
      }

      level.render(editing())
      timer.draw(viewState === "game")
    }
  } finally {
    requestAnimationFrame(loop)
  }
}

const loadNextLevel = async () => {
  const next = await fetchNextLevel()

  if (!next) {
    await showOverview()
    return
  }

  installLevel(next)
}

const fetchNextLevel = async (): Promise<LoadedLevel | null> => {
  const index = currentLevelIndex === null ? 0 : currentLevelIndex + 1
  const id = levelIds[index]

  if (id === undefined) return null

  return { index, id, data: await fetchLevel(id) }
}

const installLevel = ({ index, id, data }: LoadedLevel) => {
  currentLevelIndex = index
  level?.destroy()
  level = new Level(id, data)
  gameMode.setLevel(level)
  editMode.setLevel(level)
}

const loadLevel = async (id: number, index: number) =>
  installLevel({ index, id, data: await fetchLevel(id) })

const createNewLevel = () => {
  level?.destroy()
  level = new Level(null, emptyLevelData())
  gameMode.setLevel(level)
  editMode.setLevel(level)
}

setOnCloseLevel(() => showOverview())

setOverviewHandlers({
  editLevel: async (id, ids) => {
    await loadFromOverview(id, ids)
    enterState("edit-level")
  },

  playLevel: async (id, ids) => {
    await loadFromOverview(id, ids)
    enterState("game")
  },

  createLevel: () => {
    createNewLevel()
    enterState("edit-level")
  },
})

const loadFromOverview = async (id: number, ids: number[]) => {
  levelIds = ids
  await loadLevel(id, ids.indexOf(id))
}

const enterState = (state: ViewState) => {
  viewState = state
  setViewState(state)
  level?.reset()
  timer.start(level?.data.duration ?? 0)
}

const showOverview = async () => {
  dialogueLayer.dismiss()
  enterState("edit-overview")
  await openOverview()
}

const start = async () => {
  levelIds = await fetchLevelIds()
  await loadNextLevel()
  enterState("game")

  dialogueLayer.title()
  requestAnimationFrame(loop)
}

start()

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) lastTime = performance.now()
})
window.addEventListener("focus", () => {
  lastTime = performance.now()
})

const OPEN_OVERVIEW_CLICKS = 3

const VARIANT_BY_QUADRANT = [
  [0, 1],
  [3, 2],
] as const

document.addEventListener("click", (e) => {
  const local: Point = { x: e.clientX - origin.x, y: e.clientY - origin.y }

  if (local.x < 0 || local.x >= GRID.SIZE || local.y < 0 || local.y >= GRID.SIZE) {
    if (e.detail === OPEN_OVERVIEW_CLICKS && viewState === "game") showOverview()
    return
  }

  const tilePos = pixelToTile(local)

  const tileOrigin: Point = {
    x: DOT.CC + tilePos.x * TILE.CC,
    y: DOT.CC + tilePos.y * TILE.CC,
  }
  const col = local.x - tileOrigin.x >= TILE.SIZE / 2 ? 1 : 0
  const row = local.y - tileOrigin.y >= TILE.SIZE / 2 ? 1 : 0
  const variant = VARIANT_BY_QUADRANT[row][col]

  currentMode().handleClick(tilePos, variant)
})
