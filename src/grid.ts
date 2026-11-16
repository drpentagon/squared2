import { DOT, GRID, PANEL } from "./lib/constants"
import { Point } from "./lib/point"

export const origin: Point = { x: 0, y: 0 }

export const viewport = { landscape: false, scale: 1 }

const MARGIN = DOT.CC
const FRAMED_SIZE = GRID.SIZE + 2 * MARGIN

export const updateLayout = () => {
  const { innerWidth, innerHeight } = window

  viewport.landscape = innerWidth > innerHeight
  viewport.scale = Math.min(1, Math.min(innerWidth, innerHeight) / FRAMED_SIZE)

  origin.x = Math.floor(innerWidth / (2 * viewport.scale) - GRID.SIZE / 2)
  origin.y = Math.floor(innerHeight / (2 * viewport.scale) - GRID.SIZE / 2)

  const root = document.documentElement.style
  root.setProperty("--grid-origin-x", String(origin.x * viewport.scale))
  root.setProperty("--grid-origin-y", String(origin.y * viewport.scale))
  root.setProperty("--grid-size", String(GRID.SIZE * viewport.scale))
  root.setProperty("--panel-width", String(PANEL.WIDTH))
  root.setProperty("--dot-spacing", String(DOT.SPACING))
  root.setProperty("--dot-cc", String(DOT.CC))
}

updateLayout()
