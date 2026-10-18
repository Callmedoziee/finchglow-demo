import { afterEach, describe, expect, it } from 'vitest'
import { setOnline } from '@/test/network'
import { ApiError, configureApi, fetchAlerts } from './mockApi'

afterEach(() => {
  configureApi({ delayMs: 400, failureRate: 0 })
  setOnline(true)
})

describe('mock API', () => {
  it('returns data when it is healthy', async () => {
    configureApi({ delayMs: 0, failureRate: 0 })
    expect((await fetchAlerts()).length).toBeGreaterThan(0)
  })

  it('keeps existing settings when a field is left undefined', async () => {
    configureApi({ delayMs: 0, failureRate: 1 })
    configureApi({ failureRate: undefined })
    await expect(fetchAlerts()).rejects.toBeInstanceOf(ApiError)
  })

  it('rejects as soon as the device is offline, like a real network call would', async () => {
    configureApi({ delayMs: 0, failureRate: 0 })
    setOnline(false)
    await expect(fetchAlerts()).rejects.toThrow('You are offline.')
  })

  it('rejects with an ApiError when it is set to fail', async () => {
    configureApi({ delayMs: 0, failureRate: 1 })
    await expect(fetchAlerts()).rejects.toBeInstanceOf(ApiError)
  })
})
