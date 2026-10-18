import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Header } from '@/components/layouts/Header'
import { currentEmployee } from '@/data/mockData'
import { AlertsBar } from '@/features/alerts/AlertsBar'
import { AlertsGate } from '@/features/alerts/AlertsGate'
import { AlertsProvider } from '@/features/alerts/AlertsProvider'
import { CompanyProvider } from '@/features/company/CompanyProvider'
import { PortalHome } from '@/features/home/PortalHome'

/**
 * Renders the signed-in page the way App does: header, alert bands, then the page.
 * `extra` adds anything else to the tree (for example the demo panel).
 */
export const renderPortal = ({ companyId = 'ota', extra }: { companyId?: string; extra?: ReactNode } = {}) =>
  render(
    <CompanyProvider initialCompanyId={companyId}>
      <AlertsProvider>
        <Header />
        <AlertsGate>
          <AlertsBar />
          <main>
            <PortalHome employee={currentEmployee} />
          </main>
        </AlertsGate>
        {extra}
      </AlertsProvider>
    </CompanyProvider>,
  )
