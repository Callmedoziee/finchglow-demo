import { describe, expect, it } from 'vitest'
import { getSharedDevice } from './deviceConfig'

describe('getSharedDevice', () => {
  it('is not a shared device unless asked', () => {
    expect(getSharedDevice('')).toBeNull()
    expect(getSharedDevice('?device=personal')).toBeNull()
    expect(getSharedDevice('?idle=20')).toBeNull()
  })

  it('signs out after five minutes by default', () => {
    expect(getSharedDevice('?device=shared')?.idleMs).toBe(300_000)
  })

  it('accepts a shorter timeout in seconds for demos', () => {
    expect(getSharedDevice('?device=shared&idle=20')?.idleMs).toBe(20_000)
  })

  it('ignores a timeout that is not a positive whole number', () => {
    for (const bad of ['0', '-5', 'abc', '2.5', '']) {
      expect(getSharedDevice(`?device=shared&idle=${bad}`)?.idleMs).toBe(300_000)
    }
  })
})
