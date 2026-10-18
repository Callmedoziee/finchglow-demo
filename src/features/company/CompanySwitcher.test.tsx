import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Header } from '@/components/layouts/Header'
import { AlertsProvider } from '@/features/alerts/AlertsProvider'
import { CompanyProvider } from './CompanyProvider'

const renderHeader = () =>
  render(
    <CompanyProvider initialCompanyId="ota">
      <AlertsProvider>
        <Header />
      </AlertsProvider>
    </CompanyProvider>,
  )

const trigger = () => screen.getByRole('button', { name: /^company/i })

describe('CompanySwitcher', () => {
  it('starts closed, and opens a list of every company', async () => {
    const user = userEvent.setup()
    renderHeader()
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: /^FCM Travel Nigeria/ })).not.toBeInTheDocument()

    await user.click(trigger())

    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('button', { name: /travel|academy|holidays|shared|travelden/i }).length).toBeGreaterThanOrEqual(6)
    expect(screen.getByRole('button', { name: /^Travelden/ })).toHaveAttribute('aria-current', 'true')
  })

  it('closes on Escape and gives focus back to the button', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(trigger())

    await user.keyboard('{Escape}')

    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveFocus()
  })

  it('closes when you click elsewhere', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(trigger())

    await user.click(document.body)

    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes after choosing, and the button shows the new company', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(trigger())

    await user.click(screen.getByRole('button', { name: /^Finchglow Holidays/ }))

    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveTextContent('Finchglow Holidays')
  })

  it('has no automatically detectable accessibility violations while open', async () => {
    const user = userEvent.setup()
    const { container } = renderHeader()
    await user.click(trigger())

    expect(await axe(container)).toHaveNoViolations()
  })
})
