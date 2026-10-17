import type { Company } from '../types/portal'

/** Writes the company's tokens as CSS variables. Components only read variables. */
export const applyTheme = (company: Company, root: HTMLElement = document.documentElement): void => {
  root.style.setProperty('--color-accent', company.accent)
  root.style.setProperty('--color-on-accent', company.onAccent)
  root.style.setProperty('--color-accent-soft', company.accentSoft)
  root.dataset.company = company.id
}
