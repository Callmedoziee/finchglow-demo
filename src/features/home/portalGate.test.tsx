import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { requestRefresh } from '@/features/offline/refreshEvent'
import { renderPortal } from '@/test/renderPortal'

const renderHome = () => renderPortal()

afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('Alerts settle before the rest of the page', () => {
  it('shows only "Loading your portal" until alerts and apps arrive, so nothing is pushed down later', async () => {
    configureApi({ delayMs: 100, failureRate: 0 })
    renderHome()

    expect(screen.getByText('Loading your portal...')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()

    expect(await screen.findByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('does not hold the page back for more than the time limit if the alerts service is very slow', async () => {
    configureApi({ delayMs: 3000, failureRate: 0 })
    renderHome()

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    // Appears at the 1.5 second limit, well before the alerts do.
    expect(await screen.findByRole('heading', { level: 1 }, { timeout: 2500 })).toBeInTheDocument()
    expect(screen.queryByRole('alert', { name: /payment gateway failure/i })).not.toBeInTheDocument()
  })

  it('never hides the page again when a retry starts after it has appeared', async () => {
    configureApi({ delayMs: 0, failureRate: 0 })
    renderPortal()
    await screen.findByRole('alert', { name: /payment gateway failure/i })

    configureApi({ delayMs: 300 })
    act(() => requestRefresh())

    // A refresh is now in flight. The band and the page must still be on screen.
    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.queryByText('Loading your portal...')).not.toBeInTheDocument()
  })

  it('never hides the page again on a retry, even when nothing could be saved on the device to show meanwhile', async () => {
    // Storage that refuses to save (full or blocked) means a retry has no saved copy to fall back on,
    // so the alerts and apps really do go back to "loading". The page must still stay.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage is full')
    })
    configureApi({ delayMs: 0, failureRate: 0 })
    renderPortal()
    await screen.findByRole('alert', { name: /payment gateway failure/i })

    configureApi({ delayMs: 300 })
    act(() => requestRefresh())

    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.queryByText('Loading your portal...')).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('keeps the page and the error on screen while "Try again" runs after a first load that failed', async () => {
    configureApi({ delayMs: 0, failureRate: 1 })
    const user = userEvent.setup()
    renderPortal()
    // Nothing was ever saved, so the alerts show an error and the page is drawn around it.
    expect(await screen.findByText(/alerts could not be loaded/i)).toBeInTheDocument()

    configureApi({ delayMs: 300, failureRate: 0 })
    await user.click(screen.getAllByRole('button', { name: /try again/i })[0])

    // The retry is in flight (alerts are "loading" again with nothing to show). The page must not be hidden.
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.queryByText('Loading your portal...')).not.toBeInTheDocument()
    expect(await screen.findByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
  })
})
