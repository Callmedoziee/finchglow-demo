import { describe, expect, it } from 'vitest'
import { toError } from './toError'

describe('toError', () => {
  it('returns an Error unchanged', () => {
    const original = new Error('boom')
    expect(toError(original)).toBe(original)
  })

  it('wraps a thrown string', () => {
    expect(toError('oops').message).toBe('oops')
  })

  it('shows a plain object as readable JSON, not [object Object]', () => {
    expect(toError({ code: 500 }).message).toBe('{"code":500}')
  })

  it('does not crash on values JSON cannot handle', () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(toError(circular).message).toBe('Unknown error')
    expect(toError(undefined).message).toBe('Unknown error')
  })
})
