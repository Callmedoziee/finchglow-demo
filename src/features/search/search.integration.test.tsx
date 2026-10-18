import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test/renderPortal'

const renderHome = () => renderPortal()

const searchFor = async (text: string) => {
  const user = userEvent.setup()
  await user.type(await screen.findByRole('searchbox', { name: /search apps and news/i }), text)
  return user
}

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('Search', () => {
  it('shows matching apps and news, announces the count, and replaces the launcher', async () => {
    renderHome()
    await searchFor('booking')

    // Wait for the results themselves: the Booking Engine link also exists in the launcher beforehand.
    expect(await screen.findByText(/2 results for "booking"/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /booking engine/i })).toBeInTheDocument()
    expect(screen.getByText('Summer holiday packages open for booking')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Your tools' })).not.toBeInTheDocument()
  })

  it('keeps the critical alert on screen while searching', async () => {
    renderHome()
    await searchFor('booking')
    await screen.findByText(/2 results for "booking"/i)

    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
  })

  it('only searches what the selected company can see', async () => {
    renderHome()
    await searchFor('agent')

    expect(await screen.findByText(/nothing found for/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /agent console/i })).not.toBeInTheDocument()
  })

  it('shows a helpful empty state with a way out, and Clear returns to the normal page', async () => {
    renderHome()
    const user = await searchFor('zzzz')

    expect(await screen.findByText(/nothing found for/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear search/i }))

    expect(await screen.findByRole('heading', { name: 'Your tools' })).toBeInTheDocument()
  })

  it('shows an error with Retry when the search fails, then recovers', async () => {
    renderHome()
    await screen.findByText('Booking platform running slowly')
    configureApi({ failureRate: 1 })
    const user = await searchFor('booking')

    // The payment banner is also an alert, so wait for the search failure message specifically.
    expect(await screen.findByText(/the service could not be reached/i)).toBeInTheDocument()

    configureApi({ failureRate: 0 })
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(await screen.findByText(/2 results for "booking"/i)).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations in the results view', async () => {
    const { container } = renderHome()
    await searchFor('booking')
    await screen.findByText(/2 results for "booking"/i)

    expect(await axe(container)).toHaveNoViolations()
  })
})
