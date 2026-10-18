import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { loadFromCache, saveToCache } from '@/lib/offlineCache'
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
})
