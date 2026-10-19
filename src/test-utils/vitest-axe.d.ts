import type { AxeMatchers } from 'vitest-axe/matchers'

// Tells TypeScript about the matcher we registered in setup.ts.
declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
