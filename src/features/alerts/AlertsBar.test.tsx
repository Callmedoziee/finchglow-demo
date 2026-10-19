import { screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test-utils/renderPortal'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('Critical alert band', () => {
  it('sits above the page, outside <main>, so it spans the full width', async () => {
    renderPortal()
    const band = await screen.findByRole('alert', { name: /payment gateway failure/i })

    expect(screen.getByRole('main')).not.toContainElement(band)
  })

  it('says it is critical, who it is for, and when it started', async () => {
    renderPortal()
    const band = await screen.findByRole('alert', { name: /payment gateway failure/i })

    expect(within(band).getByText('Critical')).toBeInTheDocument()
    expect(band).toHaveTextContent(/group-wide/i)
    expect(band).toHaveTextContent(/started \d{2}:\d{2}/i)
  })

  it('cannot be dismissed or acknowledged away', async () => {
    renderPortal()
    const band = await screen.findByRole('alert', { name: /payment gateway failure/i })

    expect(within(band).queryByRole('button')).not.toBeInTheDocument()
  })
})
