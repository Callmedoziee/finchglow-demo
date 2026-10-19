import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useDebouncedValue', () => {
  it('starts with the initial value', () => {
    const { result } = renderHook(() => useDebouncedValue('a', 250))
    expect(result.current).toBe('a')
  })

  it('only updates after the value has been still for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 250), { initialProps: { value: 'a' } })

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')

    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a') // the timer restarted with the new keystroke

    act(() => vi.advanceTimersByTime(50))
    expect(result.current).toBe('abc')
  })
})
