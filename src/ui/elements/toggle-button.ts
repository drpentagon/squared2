import { Button } from "./button"
import { Diode } from "./diode"

export class ToggleButton {
  readonly el: HTMLButtonElement
  private diode = new Diode()

  constructor(
    text: string,
    private active: boolean,
    private onToggle: (active: boolean) => void,
  ) {
    this.el = new Button(text, this.toggle, "button--toggle").el
    this.el.appendChild(this.diode.el)
    this.diode.setOn(active)
  }

  private toggle = () => {
    this.active = !this.active
    this.diode.setOn(this.active)
    this.onToggle(this.active)
  }
}
