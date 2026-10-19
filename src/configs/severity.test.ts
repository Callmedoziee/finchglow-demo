import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/utils/theme/contrast'
import type { Severity } from '@/types/portal'
import { severityStyles } from './severity'

const severities = Object.keys(severityStyles) as Severity[]

describe('severity colours', () => {
  it.each(severities)('%s text meets WCAG AA (4.5:1) on its background', (severity) => {
    const { foreground, background } = severityStyles[severity]
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(severities)('%s border meets the 3:1 non-text contrast against the page', (severity) => {
    expect(contrastRatio(severityStyles[severity].border, '#f5f7fa')).toBeGreaterThanOrEqual(3)
  })
})
