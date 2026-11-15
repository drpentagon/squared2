class Clock {
  #lastTime = 0

  constructor() {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) this.resync()
    })
    window.addEventListener("focus", () => this.resync())
  }

  tick = (timestamp: number) => {
    const dt = (timestamp - this.#lastTime) / 1000
    this.#lastTime = timestamp
    return dt
  }

  resync = () => {
    this.#lastTime = performance.now()
  }
}

export const clock = new Clock()
