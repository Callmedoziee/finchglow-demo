import { lazy, Suspense } from 'react'
import { fetchEmployee } from '@/api/mockApi'
import { ErrorMessage, LoadingMessage } from '@/components/feedback'
import { Header } from '@/components/Header'
import { PortalHome } from '@/components/PortalHome'
import { CompanyProvider } from '@/context/CompanyProvider'
import { useAsync } from '@/hooks/useAsync'
import { isDemoMode } from '@/lib/demoMode'

// Loaded on demand: normal users never download the demo controls.
const DemoPanel = lazy(() => import('@/components/DemoPanel').then((module) => ({ default: module.DemoPanel })))

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
      <SkipLink />
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <PortalHome employee={session.data} />
      </main>
      {isDemoMode() && (
        <Suspense fallback={null}>
          <DemoPanel />
        </Suspense>
      )}
    </CompanyProvider>
  )
}

export default App
