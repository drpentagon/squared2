import { DOT, GRID, PANEL } from "./lib/constants"
import { Point } from "./lib/point"

export const origin: Point = { x: 0, y: 0 }

const updateOrigin = () => {
  origin.x = Math.floor((window.innerWidth - GRID.SIZE) / 2)
  origin.y = Math.floor((window.innerHeight - GRID.SIZE) / 2)

  const root = document.documentElement.style
  root.setProperty("--grid-origin-x", String(origin.x))
  root.setProperty("--grid-origin-y", String(origin.y))
  root.setProperty("--grid-size", String(GRID.SIZE))
  root.setProperty("--panel-width", String(PANEL.WIDTH))
  root.setProperty("--dot-spacing", String(DOT.SPACING))
  root.setProperty("--dot-cc", String(DOT.CC))
}

updateOrigin()
window.addEventListener("resize", updateOrigin)
