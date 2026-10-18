import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/api/mockApi'
import { PortalHome } from '@/components/PortalHome'
import { CompanyProvider } from '@/context/CompanyProvider'
import { currentEmployee } from '@/data/mockData'

const renderHome = () =>
  render(
    <CompanyProvider initialCompanyId="ota">
      <PortalHome employee={currentEmployee} />
    </CompanyProvider>,
  )

afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('Alerts settle before the rest of the page', () => {
  it('shows only "Checking for alerts" until the alerts arrive, so nothing is pushed down later', async () => {
    configureApi({ delayMs: 100, failureRate: 0 })
    renderHome()

    expect(screen.getByText('Checking for alerts...')).toBeInTheDocument()
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
})
