import { Button } from "./elements/button"
import { Divider } from "./elements/divider"

export type LevelOverviewActions = {
  edit: () => void
  moveBack: () => void
  moveForward: () => void
  play: () => void
  remove: () => void
}

export class LevelOverviewPanel {
  private container: HTMLElement
  private backButton: HTMLButtonElement
  private forwardButton: HTMLButtonElement

  constructor(actions: LevelOverviewActions) {
    this.container = document.createElement("div")
    this.container.id = "level-overview-panel"
    this.container.className = "edit-panel"
    this.container.style.display = "none"

    const back = new Button("←", actions.moveBack, "button--small")
    const forward = new Button("→", actions.moveForward, "button--small")
    this.backButton = back.el
    this.forwardButton = forward.el

    const moveRow = document.createElement("div")
    moveRow.className = "button-row"
    moveRow.append(back.el, forward.el)

    this.container.append(
      new Button("Edit", actions.edit).el,
      moveRow,
      new Divider().el,
      new Button("Play", actions.play, "button--primary").el,
      new Button("Delete", actions.remove, "button--delete").el,
    )
    document.body.appendChild(this.container)
  }

  show = (canMoveBack: boolean, canMoveForward: boolean) => {
    this.backButton.disabled = !canMoveBack
    this.forwardButton.disabled = !canMoveForward
    this.container.style.display = "flex"
  }

  hide = () => {
    this.container.style.display = "none"
  }
}
