import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'

// Adds expect(...).toHaveNoViolations() for accessibility checks.
expect.extend(axeMatchers)

// Vitest does not auto-clean rendered components between tests, so do it here.
afterEach(() => cleanup())
