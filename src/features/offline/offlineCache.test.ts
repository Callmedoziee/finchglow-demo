import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadFromCache, saveToCache } from './offlineCache'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('offline cache', () => {
  it('saves data with a timestamp and loads it back', () => {
    saveToCache('alerts', [{ id: 'a-1' }])

    const entry = loadFromCache<{ id: string }[]>('alerts')
    expect(entry?.data).toEqual([{ id: 'a-1' }])
    expect(Number.isNaN(Date.parse(entry?.savedAt ?? ''))).toBe(false)
  })

  it('returns null when nothing was saved', () => {
    expect(loadFromCache('alerts')).toBeNull()
  })

  it('returns null, without crashing, when the saved text is corrupt', () => {
    localStorage.setItem('finchglow-portal:alerts', '{not json')
    expect(loadFromCache('alerts')).toBeNull()
  })

  it('returns null when the saved value has the wrong shape', () => {
    localStorage.setItem('finchglow-portal:alerts', JSON.stringify({ hello: 'world' }))
    expect(loadFromCache('alerts')).toBeNull()
  })

  it('does not crash when storage refuses to save (full or blocked)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveToCache('alerts', [])).not.toThrow()
  })
})
