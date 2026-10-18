import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Header } from '@/components/layouts/Header'
import { AlertsProvider } from '@/features/alerts/AlertsProvider'
import { companies } from '@/configs/companies'
import { contrastRatio } from '@/theme/contrast'
import type { Company } from '@/types/portal'
import { CompanyProvider } from './CompanyProvider'

const seventhCompany: Company = {
  id: 'cargo',
  name: 'Test Cargo Company',
  logo: { src: '/brands/travelden-white.png', width: 216, height: 66, alt: 'Test Cargo Company logo' },
  logoBackground: '#136d3d',
  tagline: 'Air cargo and freight',
  accent: '#136d3d',
  onAccent: '#ffffff',
  accentSoft: '#ecf3ef',
}

afterEach(() => {
  // Leave the shared config as we found it.
  const index = companies.findIndex((company) => company.id === seventhCompany.id)
  if (index !== -1) companies.splice(index, 1)
})

describe('Adding a seventh company by configuration only', () => {
  it('shows up in the switcher, and selecting it re-brands the page, with no component changes', async () => {
    companies.push(seventhCompany)
    const user = userEvent.setup()
    render(
      <CompanyProvider initialCompanyId="ota">
        <AlertsProvider>
          <Header />
        </AlertsProvider>
      </CompanyProvider>,
    )

    await user.selectOptions(screen.getByRole('combobox', { name: /company/i }), 'cargo')

    expect(screen.getByRole('img', { name: 'Test Cargo Company logo' })).toBeInTheDocument()
    expect(screen.getByText('Air cargo and freight')).toBeInTheDocument()
    expect(document.documentElement.style.getPropertyValue('--color-accent')).toBe('#136d3d')
    expect(document.documentElement.dataset.company).toBe('cargo')
  })

  it('has a colour that passes the same contrast rule the existing companies must pass', () => {
    expect(contrastRatio(seventhCompany.accent, seventhCompany.onAccent)).toBeGreaterThanOrEqual(4.5)
  })
})
