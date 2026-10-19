import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Header } from '@/components/layouts/Header'
import { currentEmployee } from '@/data/mockData'
import { AlertsBar } from '@/features/alerts/AlertsBar'
import { AlertsProvider } from '@/utils/context/AlertsProvider'
import { CompanyProvider } from '@/utils/context/CompanyProvider'
import { PortalGate } from '@/features/home/components/PortalGate'
import { PortalHome } from '@/features/home/PortalHome'
import { AppsProvider } from '@/utils/context/AppsProvider'

/**
 * Renders the signed-in page the way App does: header, alert bands, then the page.
 * `extra` adds anything else to the tree (for example the demo panel).
 */
export const renderPortal = ({ companyId = 'ota', extra }: { companyId?: string; extra?: ReactNode } = {}) =>
  render(
    <CompanyProvider initialCompanyId={companyId}>
      <AlertsProvider>
        <AppsProvider>
          <Header />
          <PortalGate>
            <AlertsBar />
            <main>
              <PortalHome employee={currentEmployee} />
            </main>
          </PortalGate>
          {extra}
        </AppsProvider>
      </AlertsProvider>
    </CompanyProvider>,
  )
