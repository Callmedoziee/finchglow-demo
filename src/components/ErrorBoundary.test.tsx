import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const BrokenComponent = (): never => {
  throw new Error('boom')
}

beforeEach(() => {
  // React and the boundary both log the error on purpose; keep the test output clean.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('ErrorBoundary', () => {
  it('shows its children when nothing is wrong', () => {
    render(
      <ErrorBoundary>
        <p>All fine</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('All fine')).toBeInTheDocument()
  })

  it('shows a recovery screen instead of a blank page when a child crashes', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('button', { name: /reload the portal/i })).toBeInTheDocument()
  })

  it('reports the error so it can be monitored', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    )

    expect(console.error).toHaveBeenCalledWith('Unexpected error in the portal', expect.any(Error), expect.any(String))
  })

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
