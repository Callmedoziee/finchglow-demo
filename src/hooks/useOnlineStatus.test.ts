import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { setOnline } from '@/test-utils/network'
import { useOnlineStatus } from './useOnlineStatus'

afterEach(() => setOnline(true))

describe('useOnlineStatus', () => {
  it('starts online', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
  })

  it('follows the browser going offline and coming back', () => {
    const { result } = renderHook(() => useOnlineStatus())

    act(() => setOnline(false))
    expect(result.current).toBe(false)

    act(() => setOnline(true))
    expect(result.current).toBe(true)
  })
})
