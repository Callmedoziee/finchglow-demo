import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'

// Adds expect(...).toHaveNoViolations() for accessibility checks.
expect.extend(axeMatchers)

// jsdom has no layout, so it does not implement scrolling. Components may call it; tests just ignore it.
Element.prototype.scrollIntoView = () => {}

// jsdom has no <dialog> behaviour yet. These stand-ins open and close it the way a browser would (without the focus trap).
HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close = function close() {
  if (!this.hasAttribute('open')) return
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}
// Browsers close a modal dialog on Escape by themselves; jsdom does not.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') document.querySelector<HTMLDialogElement>('dialog[open]')?.close()
})

// Vitest does not auto-clean rendered components between tests, so do it here.
afterEach(() => {
  cleanup()
  // Saved offline copies must not leak from one test into the next.
  localStorage.clear()
})
