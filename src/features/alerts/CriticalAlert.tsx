import { useId } from 'react'
import { SeverityIcon } from './SeverityIcon'
import { severityStyles } from '@/configs/severity'
import { formatPublished } from '@/lib/formatPublished'
import type { Alert } from '@/types/portal'

/**
 * Critical alerts are solid, full-width and not dismissible.
 * role="alert" makes screen readers announce it immediately when it appears.
 */
export const CriticalAlert = ({ alert }: { alert: Alert }) => {
  const titleId = useId()
  const style = severityStyles.critical

  return (
    <section
      role="alert"
      aria-labelledby={titleId}
      style={{ backgroundColor: style.background, color: style.foreground, borderColor: style.border }}
      className="rounded-lg border-4 p-4 sm:p-5"
    >
      <div className="flex gap-3 sm:gap-4">
        <SeverityIcon severity="critical" className="size-8 shrink-0 sm:size-10" />
        <div>
          <p className="text-sm font-bold uppercase tracking-widest">{style.label}</p>
          <h2 id={titleId} className="text-xl font-bold sm:text-2xl">
            {alert.title}
          </h2>
          <p className="mt-1 text-base">{alert.body}</p>
          <p className="mt-2 text-sm">
            <time dateTime={alert.publishedAt}>{formatPublished(alert.publishedAt)}</time>
          </p>
        </div>
      </div>
    </section>
  )
}
