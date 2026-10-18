import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { loadFromCache, saveToCache } from './offlineCache'
import { setOnline } from '@/test/network'
import { useCachedAsync } from './useCachedAsync'

describe('useCachedAsync', () => {
  it('returns fresh data and saves a copy for later', async () => {
    const load = vi.fn().mockResolvedValue(['fresh'])
    const { result } = renderHook(() => useCachedAsync('alerts', load))

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ data: ['fresh'], savedAt: null })
    expect(loadFromCache('alerts')?.data).toEqual(['fresh'])
  })

  it('falls back to the saved copy when the request fails', async () => {
    saveToCache('alerts', ['saved'])
    const load = vi.fn().mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useCachedAsync('alerts', load))

    await waitFor(() => expect(result.current.status).toBe('stale'))
    expect(result.current).toMatchObject({ data: ['saved'] })
    expect(typeof (result.current as { savedAt: string }).savedAt).toBe('string')
  })

  it('reports an error when the request fails and nothing was saved', async () => {
    const load = vi.fn().mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useCachedAsync('alerts', load))

    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('refreshes by itself when the connection comes back', async () => {
    saveToCache('alerts', ['saved'])
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(['fresh'])
    const { result } = renderHook(() => useCachedAsync('alerts', load))
    await waitFor(() => expect(result.current.status).toBe('stale'))

    setOnline(true)

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ data: ['fresh'] })
  })

  it('keeps showing the saved copy while a retry is still running', async () => {
    saveToCache('alerts', ['saved'])
    let finishRetry: (value: string[]) => void = () => {}
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockReturnValueOnce(new Promise<string[]>((resolve) => (finishRetry = resolve)))
    const { result } = renderHook(() => useCachedAsync('alerts', load))
    await waitFor(() => expect(result.current).toMatchObject({ status: 'stale', isRefreshing: false }))

    act(() => result.current.reload())
    expect(result.current).toMatchObject({ status: 'stale', data: ['saved'], isRefreshing: true })

    act(() => finishRetry(['fresh']))
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: ['fresh'] }))
  })

  it('keeps showing the last fresh data during a retry even when the device cannot save a copy', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage is full')
    })
    let finishRetry: (value: string[]) => void = () => {}
    const load = vi
      .fn()
      .mockResolvedValueOnce(['first'])
      .mockReturnValueOnce(new Promise<string[]>((resolve) => (finishRetry = resolve)))
    const { result } = renderHook(() => useCachedAsync('alerts', load))
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: ['first'] }))

    act(() => result.current.reload())

    expect(result.current).toMatchObject({ status: 'stale', data: ['first'], isRefreshing: true })
    act(() => finishRetry(['second']))
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: ['second'] }))
    vi.restoreAllMocks()
  })

  it('falls back to the last fresh data when a refresh fails and the device cannot save a copy', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage is full')
    })
    const load = vi.fn().mockResolvedValueOnce(['first']).mockRejectedValueOnce(new Error('offline'))
    const { result } = renderHook(() => useCachedAsync('alerts', load))
    await waitFor(() => expect(result.current.status).toBe('success'))

    act(() => result.current.reload())

    await waitFor(() => expect(result.current).toMatchObject({ status: 'stale', data: ['first'], isRefreshing: false }))
    vi.restoreAllMocks()
  })
})
