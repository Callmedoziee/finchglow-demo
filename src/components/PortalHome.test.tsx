import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/api/mockApi'
import { CompanySwitcher } from '@/components/CompanySwitcher'
import { PortalHome } from '@/components/PortalHome'
import { CompanyProvider } from '@/context/CompanyProvider'
import { currentEmployee } from '@/data/mockData'

const renderHome = (companyId = 'ota') =>
  render(
    <CompanyProvider initialCompanyId={companyId}>
      <CompanySwitcher />
      <PortalHome employee={currentEmployee} />
    </CompanyProvider>,
  )

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('PortalHome alerts and news', () => {
  it('announces the critical alert as an alert, with the word Critical, not just colour', async () => {
    renderHome()

    const critical = await screen.findByRole('alert', { name: /payment gateway failure/i })
    expect(within(critical).getByText('Critical')).toBeInTheDocument()
    expect(critical).toHaveTextContent(/do not retry payments/i)
  })

  it('shows the company\'s warnings in the feed but not another company\'s', async () => {
    renderHome('ota')

    expect(await screen.findByText('Booking platform running slowly')).toBeInTheDocument()
    expect(screen.queryByText('Agent login scheduled maintenance')).not.toBeInTheDocument()
  })

  it('keeps the group-wide critical alert visible after switching company', async () => {
    const user = userEvent.setup()
    renderHome('ota')
    await screen.findByText('Booking platform running slowly')

    await user.selectOptions(screen.getByRole('combobox', { name: /company/i }), 'tmc')

    expect(screen.getByRole('alert', { name: /payment gateway failure/i })).toBeInTheDocument()
    expect(screen.queryByText('Booking platform running slowly')).not.toBeInTheDocument()
  })

  it('filters news for the selected company', async () => {
    const user = userEvent.setup()
    renderHome('ota')
    expect(await screen.findByText('Summer holiday packages open for booking')).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: /company/i }), 'academy')

    expect(screen.getByText('Academy autumn cohort begins')).toBeInTheDocument()
    expect(screen.queryByText('Summer holiday packages open for booking')).not.toBeInTheDocument()
  })

  it('says so loudly when alerts fail to load, instead of looking like "no alerts"', async () => {
    configureApi({ failureRate: 1 })
    renderHome()

    const failures = await screen.findAllByRole('alert')
    expect(failures.some((item) => /alerts could not be loaded/i.test(item.textContent ?? ''))).toBe(true)
  })

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderHome()
    await screen.findByRole('alert', { name: /payment gateway failure/i })
    await screen.findByText('Booking platform running slowly')
    await screen.findByText('Summer holiday packages open for booking')
    expect(await axe(container)).toHaveNoViolations()
  })
})
