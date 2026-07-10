import { DOT_CC, DOT_SPACING, GRID_SIZE, PANEL_WIDTH } from "./lib/constants"

export const gridOrigin = { x: 0, y: 0 }

const updateOrigin = () => {
  gridOrigin.x = Math.floor((window.innerWidth - GRID_SIZE) / 2)
  gridOrigin.y = Math.floor((window.innerHeight - GRID_SIZE) / 2)

  const root = document.documentElement.style
  root.setProperty("--grid-origin-x", String(gridOrigin.x))
  root.setProperty("--grid-origin-y", String(gridOrigin.y))
  root.setProperty("--grid-size", String(GRID_SIZE))
  root.setProperty("--panel-width", String(PANEL_WIDTH))
  root.setProperty("--dot-spacing", String(DOT_SPACING))
  root.setProperty("--dot-cc", String(DOT_CC))
}

updateOrigin()
window.addEventListener("resize", updateOrigin)
