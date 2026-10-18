import { fetchEmployee } from '@/api/mockApi'
import { ErrorMessage, LoadingMessage } from '@/components/feedback'
import { Greeting } from '@/components/Greeting'
import { Header } from '@/components/Header'
import { CompanyProvider } from '@/context/CompanyProvider'
import { useAsync } from '@/hooks/useAsync'

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
        <Greeting employee={session.data} />
      </main>
    </CompanyProvider>
  )
}

export default App
