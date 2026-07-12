import { DOT_CC, DOT_SPACING, GRID_SIZE, PANEL_WIDTH } from "./lib/constants"
import { Point } from "./lib/point"

export const origin: Point = { x: 0, y: 0 }

const updateOrigin = () => {
  origin.x = Math.floor((window.innerWidth - GRID_SIZE) / 2)
  origin.y = Math.floor((window.innerHeight - GRID_SIZE) / 2)

  const root = document.documentElement.style
  root.setProperty("--grid-origin-x", String(origin.x))
  root.setProperty("--grid-origin-y", String(origin.y))
  root.setProperty("--grid-size", String(GRID_SIZE))
  root.setProperty("--panel-width", String(PANEL_WIDTH))
  root.setProperty("--dot-spacing", String(DOT_SPACING))
  root.setProperty("--dot-cc", String(DOT_CC))
}

updateOrigin()
window.addEventListener("resize", updateOrigin)
