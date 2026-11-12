import { cloneIcon } from "./templates"

const ICON_SHAPES = {
  chevronLeft: '<polyline points="15 18 9 12 15 6" />',
  chevronRight: '<polyline points="9 18 15 12 9 6" />',
  minus: '<line x1="5" y1="12" x2="19" y2="12" />',
  play: '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />',
  plus: '<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />',
  rotateCcw: '<polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />',
  rotateCw:
    '<polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />',
} as const

export type IconName = keyof typeof ICON_SHAPES

export class Icon {
  readonly el: SVGElement

  constructor(name: IconName) {
    this.el = cloneIcon()
    this.el.innerHTML = ICON_SHAPES[name]
  }
}
