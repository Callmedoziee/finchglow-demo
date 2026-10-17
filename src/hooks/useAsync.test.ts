import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  it('starts loading, then returns the data', async () => {
    const load = vi.fn().mockResolvedValue(['ok'])
    const { result } = renderHook(() => useAsync(load))

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ status: 'success', data: ['ok'] })
  })

  it('reports an error, and recovers when reload succeeds', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce('fine')
    const { result } = renderHook(() => useAsync(load))

    await waitFor(() => expect(result.current.status).toBe('error'))

    act(() => result.current.reload())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(load).toHaveBeenCalledTimes(2)
  })
})
