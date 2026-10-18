import { lazy, Suspense } from 'react'
import { fetchEmployee } from '@/services/mockApi'
import { ErrorMessage, LoadingMessage } from '@/components/ui/feedback'
import { Footer } from '@/components/layouts/Footer'
import { Header } from '@/components/layouts/Header'
import { AlertsBar } from '@/features/alerts/AlertsBar'
import { AlertsGate } from '@/features/alerts/AlertsGate'
import { AlertsProvider } from '@/features/alerts/AlertsProvider'
import { PortalHome } from '@/features/home/PortalHome'
import { CompanyProvider } from '@/features/company/CompanyProvider'
import { useAsync } from '@/hooks/useAsync'
import { isDemoMode } from '@/features/demo/demoMode'

// Loaded on demand: normal users never download the demo controls.
const DemoPanel = lazy(() => import('@/features/demo/DemoPanel').then((module) => ({ default: module.DemoPanel })))

const SkipLink = () => (
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-10 focus:rounded-lg focus:bg-surface focus:p-3"
  >
    Skip to main content
  </a>
)

/**
 * In production the signed-in employee would come from the identity provider (SSO)
 * after login. Here the mock API plays that role.
 */
const App = () => {
  const session = useAsync(fetchEmployee)

  if (session.status !== 'success') {
    return (
      <>
        <SkipLink />
        <main id="main" className="mx-auto max-w-6xl px-4 py-6">
          {session.status === 'loading' ? (
            <LoadingMessage label="Loading your portal..." />
          ) : (
            <ErrorMessage message={session.error.message} onRetry={session.reload} />
          )}
        </main>
      </>
    )
  }

  return (
    <CompanyProvider initialCompanyId={session.data.companyId}>
      <AlertsProvider>
        <SkipLink />
        <Header />
        {/*
          This wrapper reserves a full screen of height. The alert bands and the page are inserted inside it,
          so nothing outside it moves, and the footer starts below the fold instead of being pushed down.
        */}
        <div className="min-h-dvh">
          <AlertsGate>
            <AlertsBar />
            <main id="main" className="mx-auto max-w-6xl px-4 py-6">
              <PortalHome employee={session.data} />
            </main>
          </AlertsGate>
        </div>
        <Footer />
        {isDemoMode() && (
          <Suspense fallback={null}>
            <DemoPanel />
          </Suspense>
        )}
      </AlertsProvider>
    </CompanyProvider>
  )
}

export default App
