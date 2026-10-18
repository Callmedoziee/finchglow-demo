import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHasElapsed } from './useHasElapsed'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useHasElapsed', () => {
  it('is false at first and true once the time has passed', () => {
    const { result } = renderHook(() => useHasElapsed(1500))
    expect(result.current).toBe(false)

    act(() => vi.advanceTimersByTime(1499))
    expect(result.current).toBe(false)

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe(true)
  })
})
