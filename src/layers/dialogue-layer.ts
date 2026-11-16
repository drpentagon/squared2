import { GraphicsLayer } from "./graphics-layer"
import { gameState, gameStates, StateName } from "../game-state"
import { origin } from "../grid"
import { GRID } from "../lib/constants"
import { write, writeHeadline, writeHuge } from "../lib/text"

class DialogueLayer extends GraphicsLayer {
  private onClose: (() => void) | null = null
  private previousState: StateName = gameStates.GAME

  constructor() {
    super(3)
    this.canvas.setClip(origin, GRID.SIZE, GRID.SIZE)
    this.canvas.el.style.pointerEvents = "none"
    this.canvas.el.addEventListener("click", this.handleClick)
  }

  update = (_dt: number) => {}

  show = (): Promise<void> => {
    this.enterDialogue()
    this.canvas.el.style.pointerEvents = "auto"
    return new Promise((resolve) => {
      this.onClose = resolve
    })
  }

  hide = () => {
    gameState.set(this.previousState)
    this.canvas.el.style.pointerEvents = "none"
    this.clear()
  }

  dismiss = () => {
    if (!gameState.inDialogue()) return

    this.hide()
    this.onClose?.()
    this.onClose = null
  }

  private enterDialogue = () => {
    this.previousState = gameState.current
    gameState.set(gameStates.DIALOGUE)
  }

  private handleClick = (e: MouseEvent) => {
    if (!gameState.inDialogue()) return
    e.stopPropagation()
    this.dismiss()
  }

  title = (): Promise<void> => {
    this.clear()
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
    this.clear()
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

  noConnection = () => {
    this.clear()
    write(this.canvas, "no connection", 8, 15)
    write(this.canvas, "start the server", 8, 22)
    write(this.canvas, "and reload", 8, 29)
    this.enterDialogue()
  }

  lostSquare = (): Promise<void> => {
    this.clear()
    writeHeadline(this.canvas, "Lost square", 8, 15)
    return this.show()
  }
}

export const dialogueLayer = new DialogueLayer()
