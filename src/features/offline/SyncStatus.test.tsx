import { act, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { alerts } from '@/data/mockData'
import { configureApi } from '@/services/mockApi'
import { setOnline } from '@/test/network'
import { renderPortal } from '@/test/renderPortal'
import { CACHE_KEYS, saveToCache } from './offlineCache'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => {
  configureApi({ delayMs: 400, failureRate: 0 })
  setOnline(true)
})

const chip = () => within(screen.getByRole('banner'))

describe('Sync chip in the header', () => {
  it('shows Online and the time the alerts were synced', async () => {
    renderPortal()

    expect(await chip().findByText(/online · synced \d{2}:\d{2}/i)).toBeInTheDocument()
  })

  it('says Offline when the device loses its connection, and keeps the sync time', async () => {
    renderPortal()
    await chip().findByText(/online · synced/i)

    act(() => setOnline(false))

    expect(await chip().findByText(/offline · synced \d{2}:\d{2}/i)).toBeInTheDocument()
  })

  it('says "saved" when the alerts on screen are a saved copy, even while online', async () => {
    saveToCache(CACHE_KEYS.alerts, alerts)
    configureApi({ failureRate: 1 })
    renderPortal()

    expect(await chip().findByText(/online · saved \d{2}:\d{2}/i)).toBeInTheDocument()
  })
})
