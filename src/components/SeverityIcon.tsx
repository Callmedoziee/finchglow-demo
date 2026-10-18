import type { Severity } from '@/types/portal'

const shapes: Record<Severity, React.ReactNode> = {
  // Octagon with an exclamation mark: the "stop" shape.
  critical: (
    <>
      <path d="M8.3 2.5h7.4l5.8 5.8v7.4l-5.8 5.8H8.3l-5.8-5.8V8.3z" />
      <path d="M12 7.5v5.5M12 16.2v.3" />
    </>
  ),
  // Triangle with an exclamation mark.
  warning: (
    <>
      <path d="M12 3.5 2.8 19.5h18.4z" />
      <path d="M12 10v4.5M12 17v.3" />
    </>
  ),
  // Circle with an "i".
  information: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v5.5M12 7.7v.3" />
    </>
  ),
}

/** Decorative: the severity word is always printed beside it, so screen readers skip the icon. */
export const SeverityIcon = ({ severity, className }: { severity: Severity; className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {shapes[severity]}
  </svg>
)
