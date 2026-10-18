import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../theme/contrast'
import { companies, defaultCompanyId, getCompany } from './companies'

const cases = companies.map((company) => [company.name, company] as const)

describe('company config', () => {
  it.each(cases)('%s accent meets WCAG AA (4.5:1) against its button text', (_name, company) => {
    expect(contrastRatio(company.accent, company.onAccent)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(cases)('%s accent meets 4.5:1 as text on white', (_name, company) => {
    expect(contrastRatio(company.accent, '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })

  it('has unique ids', () => {
    expect(new Set(companies.map((company) => company.id)).size).toBe(companies.length)
  })

  it('falls back to the default company for an unknown id', () => {
    expect(getCompany('nope').id).toBe(defaultCompanyId)
  })
})
