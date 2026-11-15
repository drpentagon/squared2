import { clock } from "./clock"
import { currentMode } from "./modes/modes"

export const startLoop = () => {
  requestAnimationFrame(loop)
}

const loop = async (timestamp: number) => {
  const dt = clock.tick(timestamp)
  const mode = currentMode()

  try {
    await mode.update(dt)
    mode.render()
  } finally {
    requestAnimationFrame(loop)
  }
}
