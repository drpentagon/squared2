import { Redirector } from "./redirector"
import { NEXT_DIRECTION, tileTypes } from "../lib/constants"
import { playFragileBounce } from "../lib/sound"
import { Style } from "../lib/style"
import { FRAGILE } from "../lib/styles"

export class FragileRedirector extends Redirector {
  readonly type = tileTypes.FRAGILE_REDIRECTOR
  protected readonly style: Style = FRAGILE

  onClick() {
    this.direction = NEXT_DIRECTION[this.direction]
  }

  protected onBounce() {
    this.consumed = true
    playFragileBounce()
  }
}
