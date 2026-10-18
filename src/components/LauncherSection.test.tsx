import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/api/mockApi'
import { LauncherSection } from '@/components/LauncherSection'
import { CompanySwitcher } from '@/components/CompanySwitcher'
import { CompanyProvider } from '@/context/CompanyProvider'

const renderLauncher = (companyId: string) =>
  render(
    <CompanyProvider initialCompanyId={companyId}>
      <CompanySwitcher />
      <LauncherSection />
    </CompanyProvider>,
  )

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('LauncherSection', () => {
  it('shows only the apps the selected company can open, plus group-wide apps', async () => {
    renderLauncher('ota')

    expect(await screen.findByRole('link', { name: /booking engine/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /hr self-service/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /agent console/i })).not.toBeInTheDocument()
  })

  it('updates the apps when another company is chosen', async () => {
    const user = userEvent.setup()
    renderLauncher('ota')
    await screen.findByRole('link', { name: /booking engine/i })

    await user.selectOptions(screen.getByRole('combobox', { name: /company/i }), 'Finchglow Agents')

    expect(screen.getByRole('link', { name: /agent console/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /booking engine/i })).not.toBeInTheDocument()
  })

  it('groups apps under category headings', async () => {
    renderLauncher('ota')
    await screen.findByRole('link', { name: /booking engine/i })

    expect(screen.getByRole('heading', { level: 3, name: 'Booking' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'People' })).toBeInTheDocument()
  })

  it('shows an error with Retry when the apps fail to load, then recovers', async () => {
    configureApi({ failureRate: 1 })
    const user = userEvent.setup()
    renderLauncher('ota')

    expect(await screen.findByRole('alert')).toBeInTheDocument()

    configureApi({ failureRate: 0 })
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(await screen.findByRole('link', { name: /booking engine/i })).toBeInTheDocument()
  })
})
