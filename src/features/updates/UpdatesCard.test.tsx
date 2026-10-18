import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test/renderPortal'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

const findCard = () => screen.findByRole('region', { name: /alerts & news/i })

describe('UpdatesCard', () => {
  it('shows alerts and news together, with a count on each chip', async () => {
    renderPortal({ companyId: 'ota' })
    const card = await findCard()

    expect(await within(card).findByText('Summer holiday packages open for booking')).toBeInTheDocument()
    expect(within(card).getByText('Booking platform running slowly')).toBeInTheDocument()
    expect(within(card).getByRole('button', { name: /^all \d+$/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('narrows to one kind with the chips, and says which chip is on', async () => {
    const user = userEvent.setup()
    renderPortal({ companyId: 'ota' })
    const card = await findCard()
    await within(card).findByText('Summer holiday packages open for booking')

    await user.click(within(card).getByRole('button', { name: /^news/i }))
    expect(within(card).queryByText('Booking platform running slowly')).not.toBeInTheDocument()
    expect(within(card).getByText('Summer holiday packages open for booking')).toBeInTheDocument()
    expect(within(card).getByRole('button', { name: /^news/i })).toHaveAttribute('aria-pressed', 'true')

    await user.click(within(card).getByRole('button', { name: /^alerts/i }))
    expect(within(card).queryByText('Summer holiday packages open for booking')).not.toBeInTheDocument()
    expect(within(card).getByText('Booking platform running slowly')).toBeInTheDocument()
  })

  it('labels each row with its kind and who it is for, so colour is never the only signal', async () => {
    renderPortal({ companyId: 'ota' })
    const card = await findCard()
    await within(card).findByText('Summer holiday packages open for booking')

    expect(within(card).getAllByText('News').length).toBeGreaterThan(0)
    expect(within(card).getByText('Warning')).toBeInTheDocument()
    expect(within(card).getAllByText('Group-wide').length).toBeGreaterThan(0)
  })
})
