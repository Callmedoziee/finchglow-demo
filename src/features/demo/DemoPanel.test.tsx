import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test/renderPortal'
import { DemoPanel } from './DemoPanel'

const renderDemo = () => renderPortal({ extra: <DemoPanel /> })

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('DemoPanel', () => {
  it('lets a presenter break the API, see saved data, then recover', async () => {
    const user = userEvent.setup()
    renderDemo()
    await screen.findByRole('alert', { name: /payment gateway failure/i })

    await user.click(screen.getByRole('button', { name: /simulate failure/i }))
    expect(screen.getByRole('button', { name: /simulate failure/i })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: /refresh now/i }))

    // Alerts, news and apps each fall back to their own saved copy, so there are three notices.
    expect(await screen.findAllByText(/we could not refresh them/i)).toHaveLength(3)
    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /simulate failure/i }))
    await user.click(screen.getByRole('button', { name: /refresh now/i }))

    await waitFor(() => expect(screen.queryAllByText(/we could not refresh them/i)).toHaveLength(0))
    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderDemo()
    await screen.findByRole('alert', { name: /payment gateway failure/i })
    expect(await axe(container)).toHaveNoViolations()
  })
})
