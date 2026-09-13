import { Level } from "./level"
import { Mode } from "./mode"

let currentLevel: Level

export const gameMode: Mode = {
  setLevel: (level) => {
    currentLevel = level
  },

  update: (dt) => {
    currentLevel.update(dt)
  },

  handleClick: (tilePos, variant) => {
    currentLevel.handlnteraction(tilePos, variant)
  },
}
