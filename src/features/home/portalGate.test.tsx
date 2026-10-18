import { act, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
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
})
