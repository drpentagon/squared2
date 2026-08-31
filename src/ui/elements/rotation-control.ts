export interface RotationSource<T> {
  variantIndex: (tile: T) => number
  setVariant: (tile: T, variant: number) => void
}

export class RotationControl<T> {
  readonly el: HTMLElement
  private tile: T | null = null

  constructor(private source: RotationSource<T>) {
    this.el = document.createElement("div")
    this.el.className = "rotation-control"

    const ccwButton = this.makeButton("↺", -1)
    const cwButton = this.makeButton("↻", 1)
    this.el.append(ccwButton, cwButton)
  }

  setTile = (tile: T | null) => {
    this.tile = tile
  }

  private makeButton = (label: string, direction: -1 | 1): HTMLButtonElement => {
    const button = document.createElement("button")
    button.className = "edit-panel-button"
    button.textContent = label
    button.addEventListener("click", () => this.rotate(direction))
    return button
  }

  private rotate = (direction: -1 | 1) => {
    if (!this.tile) return
    const current = this.source.variantIndex(this.tile)
    this.source.setVariant(this.tile, (current + direction + 4) % 4)
  }
}
