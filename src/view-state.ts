const STATES = ["game", "edit-overview", "edit-level"] as const

export type ViewState = (typeof STATES)[number]

export const setViewState = (state: ViewState) => {
  document.body.classList.remove(...STATES)
  document.body.classList.add(state)
}
