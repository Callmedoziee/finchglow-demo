import { afterEach, describe, expect, it } from 'vitest'
import { ApiError, configureApi, fetchAlerts } from './mockApi'

afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('mock API', () => {
  it('returns data when it is healthy', async () => {
    configureApi({ delayMs: 0, failureRate: 0 })
    expect((await fetchAlerts()).length).toBeGreaterThan(0)
  })

  it('rejects with an ApiError when it is set to fail', async () => {
    configureApi({ delayMs: 0, failureRate: 1 })
    await expect(fetchAlerts()).rejects.toBeInstanceOf(ApiError)
  })
})
