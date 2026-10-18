/** Shown while something loads. role="status" lets screen readers announce it politely. */
export const LoadingMessage = ({ label }: { label: string }) => (
  <p role="status" className="py-8 text-center text-muted">
    {label}
  </p>
)

/** Shown when a request fails. role="alert" announces it immediately and Retry lets the user recover. */
export const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div role="alert" className="rounded-lg border border-line bg-surface p-4">
    <p className="font-medium">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-3 min-h-11 rounded-lg bg-accent px-4 font-medium text-on-accent"
    >
      Try again
    </button>
  </div>
)
