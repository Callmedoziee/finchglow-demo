import { describe, expect, it } from 'vitest'
import { audienceLabel } from './audienceLabel'

describe('audienceLabel', () => {
  it('says Group-wide for items meant for everyone', () => {
    expect(audienceLabel({ companies: '*' })).toBe('Group-wide')
  })

  it('names the companies otherwise', () => {
    expect(audienceLabel({ companies: ['ota'] })).toBe('Travelden')
    expect(audienceLabel({ companies: ['ota', 'holidays'] })).toBe('Travelden, Finchglow Holidays')
  })
})
