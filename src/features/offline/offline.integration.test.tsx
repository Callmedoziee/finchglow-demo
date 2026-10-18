import { act, screen, waitFor } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test/renderPortal'
import { apps } from '@/configs/apps'
import { alerts } from '@/data/mockData'
import { CACHE_KEYS, saveToCache } from './offlineCache'
import { setOnline } from '@/test/network'

const renderHome = () => renderPortal()

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => {
  configureApi({ delayMs: 400, failureRate: 0 })
  setOnline(true)
})

describe('Offline behaviour', () => {
  it('still shows the saved critical alert, labelled as saved, when the refresh fails', async () => {
    saveToCache(CACHE_KEYS.alerts, alerts)
    configureApi({ failureRate: 1 })
    renderHome()

    expect(await screen.findByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
    expect(screen.getByText(/showing saved alerts from/i)).toBeInTheDocument()
    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toHaveTextContent(/saved copy from/i)
    expect(screen.queryByText(/alerts could not be loaded/i)).not.toBeInTheDocument()
  })

  it('shows the saved launcher apps when they cannot be refreshed', async () => {
    saveToCache(CACHE_KEYS.apps, apps)
    configureApi({ failureRate: 1 })
    renderHome()

    expect(await screen.findByText(/showing saved apps from/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /booking engine/i })).toBeInTheDocument()
  })

  it('shows a clear offline banner when the device goes offline and removes it when back online', async () => {
    renderHome()
    await screen.findByRole('alert', { name: /payment gateway failure/i })
    expect(screen.queryByText('You are offline')).not.toBeInTheDocument()

    act(() => setOnline(false))
    expect(await screen.findByText('You are offline')).toBeInTheDocument()

    act(() => setOnline(true))
    await waitFor(() => expect(screen.queryByText('You are offline')).not.toBeInTheDocument())
  })

  it('says the tools open when online while the device is offline', async () => {
    saveToCache(CACHE_KEYS.alerts, alerts)
    renderHome()
    await screen.findByRole('alert', { name: /payment gateway failure/i })
    expect(screen.queryByText('Opens when online')).not.toBeInTheDocument()

    configureApi({ failureRate: 1 })
    act(() => setOnline(false))

    expect(await screen.findByText('Opens when online')).toBeInTheDocument()
  })

  it('refreshes by itself when the connection returns, replacing the saved copy with fresh alerts', async () => {
    saveToCache(CACHE_KEYS.alerts, alerts)
    configureApi({ failureRate: 1 })
    renderHome()
    await screen.findByText(/showing saved alerts from/i)

    configureApi({ failureRate: 0 })
    act(() => setOnline(true))

    await waitFor(() => expect(screen.queryByText(/showing saved alerts from/i)).not.toBeInTheDocument())
    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations while offline with saved data', async () => {
    saveToCache(CACHE_KEYS.alerts, alerts)
    configureApi({ failureRate: 1 })
    const { container } = renderHome()
    await screen.findByText(/showing saved alerts from/i)
    act(() => setOnline(false))
    await screen.findByText('You are offline')

    expect(await axe(container)).toHaveNoViolations()
  })
})
