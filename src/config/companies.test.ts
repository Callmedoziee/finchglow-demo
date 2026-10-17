import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../theme/contrast'
import { companies, defaultCompanyId, getCompany } from './companies'

const cases = companies.map((c) => [c.name, c] as const)

describe('company config', () => {
  it.each(cases)('%s accent meets WCAG AA (4.5:1) against its button text', (_name, c) => {
    expect(contrastRatio(c.accent, c.onAccent)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(cases)('%s accent meets 4.5:1 as text on white', (_name, c) => {
    expect(contrastRatio(c.accent, '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })

  it('has unique ids', () => {
    expect(new Set(companies.map((c) => c.id)).size).toBe(companies.length)
  })

  it('falls back to the default company for an unknown id', () => {
    expect(getCompany('nope').id).toBe(defaultCompanyId)
  })
})
