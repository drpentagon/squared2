import { GraphicsLayer } from "./graphics-layer"
import { origin } from "../grid"
import { drawBackgroundPattern } from "../lib/background-pattern"
import { GRID } from "../lib/constants"
import { Style } from "../lib/style"
import { write, writeHeadline, writeHuge } from "../lib/text"

const BACKDROP_STYLE = new Style("#051e06")
const TEXT_STYLE = new Style("#ffffff")

export class DialogueLayer extends GraphicsLayer {
  private open: boolean = false
  private onClose: (() => void) | null = null

  constructor() {
    super(3)
    this.canvas.setClip(origin, GRID.SIZE, GRID.SIZE)
    this.canvas.el.style.pointerEvents = "none"
    this.canvas.el.addEventListener("click", this.handleClick)
  }

  update = (_dt: number) => {}

  get isOpen() {
    return this.open
  }

  show = (): Promise<void> => {
    this.open = true
    this.canvas.el.style.pointerEvents = "auto"
    return new Promise((resolve) => {
      this.onClose = resolve
    })
  }

  hide = () => {
    this.open = false
    this.canvas.el.style.pointerEvents = "none"
    this.clear()
  }

  dismiss = () => {
    if (!this.open) return

    this.hide()
    this.onClose?.()
    this.onClose = null
  }

  private handleClick = (e: MouseEvent) => {
    if (!this.open) return
    e.stopPropagation()
    this.dismiss()
  }

  title = (): Promise<void> => {
    this.draw()
    writeHuge(this.canvas, "squ", 8, 8)
    writeHuge(this.canvas, "are", 8, 36)
    writeHuge(this.canvas, "d", 8, 64)
    return this.show()
  }

  levelClear = (
    elapsedTime: number,
    bounces: number,
    redirects: number,
    score: number,
    nextLevelName: string | null,
  ): Promise<void> => {
    this.draw()
    writeHeadline(this.canvas, "Level Clear", 8, 15)
    write(this.canvas, "time", 8, 29)
    write(this.canvas, `${Math.round(elapsedTime)}`, 50, 29)
    write(this.canvas, "Bounces", 8, 36)
    write(this.canvas, `${bounces}`, 50, 36)
    write(this.canvas, "Redirects", 8, 43)
    write(this.canvas, `${redirects}`, 50, 43)
    write(this.canvas, "score", 8, 50)
    write(this.canvas, `${score}`, 50, 50)

    if (nextLevelName) {
      write(this.canvas, "next level:", 8, 64)
      writeHeadline(this.canvas, nextLevelName, 8, 71)
    }

    return this.show()
  }

  gameOver = (): Promise<void> => {
    this.draw()
    writeHeadline(this.canvas, "Game over", 8, 22)
    return this.show()
  }

  levelIntroduction = () => this.show()

  draw = () => {
    this.canvas.drawSquare(origin, GRID.SIZE, BACKDROP_STYLE)
    drawBackgroundPattern(this.canvas)
  }
}
