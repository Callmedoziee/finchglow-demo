import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches unexpected errors anywhere below it and shows a calm recovery screen instead of a blank page.
 * React only supports this as a class component. It cannot catch errors in event handlers or async code;
 * those are handled where they happen (see useAsync).
 * It deliberately uses no company theme or context, because those may be what failed.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // A real deployment would send this to a monitoring service.
    console.error('Unexpected error in the portal', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <div role="alert" className="rounded-lg border border-line bg-surface p-6">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted">
            The portal hit an unexpected problem. Your information is safe. Reloading usually fixes it. If an alert was
            showing, check your usual alert channel until the portal is back.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 min-h-11 rounded-lg bg-accent px-5 font-medium text-on-accent"
          >
            Reload the portal
          </button>
        </div>
      </main>
    )
  }
}
