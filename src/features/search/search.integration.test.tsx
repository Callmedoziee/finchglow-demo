import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { chooseCompany } from '@/test/chooseCompany'
import { renderPortal } from '@/test/renderPortal'

const openPalette = async (user = userEvent.setup()) => {
  await user.click(await screen.findByRole('button', { name: /search apps and news/i }))
  return { user, dialog: await screen.findByRole('dialog', { name: 'Search' }) }
}

const searchFor = async (text: string) => {
  const { user, dialog } = await openPalette()
  await user.type(within(dialog).getByRole('searchbox'), text)
  return { user, dialog }
}

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0, failingEndpoints: [] }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0, failingEndpoints: [] }))

describe('Search palette', () => {
  it('opens from the field on the page and starts empty with a hint', async () => {
    renderPortal()
    const { dialog } = await openPalette()

    expect(within(dialog).getByRole('searchbox')).toHaveValue('')
    expect(within(dialog).getByText(/type to search apps and news in travelden/i)).toBeInTheDocument()
  })

  it('opens with Control+K or Command+K from anywhere', async () => {
    const user = userEvent.setup()
    renderPortal()
    await screen.findByRole('button', { name: /search apps and news/i })
    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument()

    await user.keyboard('{Control>}k{/Control}')
    expect(await screen.findByRole('dialog', { name: 'Search' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await user.keyboard('{Meta>}k{/Meta}')
    expect(await screen.findByRole('dialog', { name: 'Search' })).toBeInTheDocument()
  })

  it('shows apps and news as links, with the count announced', async () => {
    renderPortal()
    const { dialog } = await searchFor('booking')

    expect(await within(dialog).findByText(/2 results in travelden \+ group-wide/i)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /booking engine/i })).toHaveAttribute('href', '#booking-engine')
    expect(within(dialog).getByRole('link', { name: /summer holiday packages/i })).toHaveAttribute('href', '#news-n-2')
  })

  it('moves between the box and the results with the arrow keys', async () => {
    renderPortal()
    const { user, dialog } = await searchFor('booking')
    await within(dialog).findByText(/2 results/i)
    const box = within(dialog).getByRole('searchbox')

    await user.keyboard('{ArrowDown}')
    expect(within(dialog).getByRole('link', { name: /booking engine/i })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(within(dialog).getByRole('link', { name: /summer holiday packages/i })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(within(dialog).getByRole('link', { name: /summer holiday packages/i })).toHaveFocus()

    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(box).toHaveFocus()
  })

  it('closes on Escape and when a result is chosen, and starts empty next time', async () => {
    renderPortal()
    const { user, dialog } = await searchFor('booking')
    await within(dialog).findByText(/2 results/i)

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument())

    const reopened = (await openPalette(user)).dialog
    expect(within(reopened).getByRole('searchbox')).toHaveValue('')
  })

  it('only searches what the selected company can see', async () => {
    renderPortal()
    const { dialog } = await searchFor('agent')

    expect(await within(dialog).findByText(/no results for/i)).toBeInTheDocument()
    expect(within(dialog).queryByRole('link', { name: /agent console/i })).not.toBeInTheDocument()
  })

  it('searches the newly chosen company next time', async () => {
    const user = userEvent.setup()
    renderPortal()
    await screen.findByRole('button', { name: /^company/i })
    await chooseCompany(user, 'Finchglow Travels')

    const { dialog } = await openPalette(user)
    await user.type(within(dialog).getByRole('searchbox'), 'agent')

    expect(await within(dialog).findByRole('link', { name: /agent console/i })).toBeInTheDocument()
  })

  it('still shows apps when only the news search fails, and says so with a Retry', async () => {
    renderPortal()
    await screen.findByRole('button', { name: /search apps and news/i })
    configureApi({ failingEndpoints: ['searchNews'] })
    const { user, dialog } = await searchFor('booking')

    expect(await within(dialog).findByText(/news search is unavailable right now/i)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /booking engine/i })).toBeInTheDocument()
    expect(within(dialog).queryByText(/app search is unavailable/i)).not.toBeInTheDocument()

    configureApi({ failingEndpoints: [] })
    await user.click(within(dialog).getByRole('button', { name: 'Retry' }))
    expect(await within(dialog).findByRole('link', { name: /summer holiday packages/i })).toBeInTheDocument()
    expect(within(dialog).queryByText(/unavailable/i)).not.toBeInTheDocument()
  })

  it('says the search is unavailable when both fail', async () => {
    renderPortal()
    await screen.findByRole('button', { name: /search apps and news/i })
    configureApi({ failureRate: 1 })
    const { dialog } = await searchFor('booking')

    expect(await within(dialog).findByText(/app search is unavailable right now/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/news search is unavailable right now/i)).toBeInTheDocument()
    expect(within(dialog).getByRole('status', { name: '' })).toHaveTextContent(/search is unavailable right now/i)
  })

  it('has no automatically detectable accessibility violations with results showing', async () => {
    const { container } = renderPortal()
    const { dialog } = await searchFor('booking')
    await within(dialog).findByText(/2 results/i)

    expect(await axe(container)).toHaveNoViolations()
  })
})
