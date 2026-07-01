import { GRID_SIZE } from "./lib/constants"

export const gridOrigin = { x: 0, y: 0 }

const updateOrigin = () => {
  gridOrigin.x = Math.floor((window.innerWidth - GRID_SIZE) / 2)
  gridOrigin.y = Math.floor((window.innerHeight - GRID_SIZE) / 2)
}

updateOrigin()
window.addEventListener("resize", updateOrigin)
