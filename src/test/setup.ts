import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'

// Adds expect(...).toHaveNoViolations() for accessibility checks.
expect.extend(axeMatchers)

// jsdom has no layout, so it does not implement scrolling. Components may call it; tests just ignore it.
Element.prototype.scrollIntoView = () => {}

// Vitest does not auto-clean rendered components between tests, so do it here.
afterEach(() => {
  cleanup()
  // Saved offline copies must not leak from one test into the next.
  localStorage.clear()
})
