const cloneTemplate = <T extends HTMLElement>(id: string): T => {
  const template = document.getElementById(id)
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`Missing <template id="${id}">`)
  }
  return template.content.firstElementChild!.cloneNode(true) as T
}

export const cloneButton = (): HTMLButtonElement => cloneTemplate("template-button")
export const cloneDivider = (): HTMLElement => cloneTemplate("template-divider")
export const cloneDiode = (): HTMLElement => cloneTemplate("template-diode")
export const clonePlusMinusButton = (): HTMLElement => cloneTemplate("template-plus-minus-button")
