import { Button } from "./button"
import { Icon, IconName } from "./icon"

export class IconButton {
  readonly el: HTMLButtonElement

  constructor(name: IconName, onClick: () => void, modifier?: string) {
    const button = new Button("", onClick, modifier)
    button.el.querySelector(".panel-button-label")!.replaceWith(new Icon(name).el)
    this.el = button.el
  }
}
