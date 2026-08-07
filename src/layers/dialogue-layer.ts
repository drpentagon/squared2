import { GraphicsLayer } from "./graphics-layer"
import { drawBackgroundPattern } from "./background-pattern"
import { origin } from "../grid"
import { GRID_SIZE } from "../lib/constants"
import { Style } from "../lib/style"

const BACKDROP_STYLE = new Style("#051e06")
const TEXT_STYLE = new Style("#ffffff")

export class DialogueLayer extends GraphicsLayer {
  private text: string | null = null
  private onClose: (() => void) | null = null

  constructor() {
    super(3)
    this.canvas.setClip(origin, GRID_SIZE, GRID_SIZE)
    this.canvas.el.addEventListener("click", this.handleClick)
  }

  update = (_dt: number) => {}

  show = (text: string): Promise<void> => {
    this.text = text
    this.draw()
    return new Promise((resolve) => {
      this.onClose = resolve
    })
  }

  hide = () => {
    this.text = null
    this.clear()
  }

  private handleClick = () => {
    if (!this.text) return
    this.hide()
    this.onClose?.()
    this.onClose = null
  }

  gameOver = () => this.show("Game Over")
  levelClear = () => this.show("Level Clear")
  levelIntroduction = (title: string) => this.show(title)

  draw = () => {
    if (!this.text) return

    this.canvas.clear()
    this.canvas.drawSquare(origin, GRID_SIZE, BACKDROP_STYLE)
    drawBackgroundPattern(this.canvas)
    this.canvas.drawText(
      this.text,
      { x: origin.x + GRID_SIZE / 2, y: origin.y + GRID_SIZE / 2 },
      TEXT_STYLE,
    )
  }
}
