import { sanitizeForFont } from "../../lib/text"
import { cloneTextInput } from "./templates"

export class TextInput {
  readonly el: HTMLInputElement

  constructor(placeholder = "", maxLength?: number, onChange?: (value: string) => void) {
    this.el = cloneTextInput()
    this.el.placeholder = placeholder
    if (maxLength !== undefined) this.el.maxLength = maxLength
    this.el.addEventListener("input", () => {
      const sanitized = sanitizeForFont(this.el.value)
      if (sanitized !== this.el.value) this.el.value = sanitized
      onChange?.(sanitized)
    })
  }

  get value(): string {
    return this.el.value
  }

  set value(value: string) {
    this.el.value = sanitizeForFont(value)
  }
}
