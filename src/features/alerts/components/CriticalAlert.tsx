import { useId } from 'react'
import { SeverityIcon } from '@/components/icon/SeverityIcon'
import { severityStyles } from '@/configs/severity'
import { audienceLabel } from '@/utils/helpers/audienceLabel'
import { formatTimeOfDay } from '@/utils/helpers/formatPublished'
import type { Alert } from '@/types/portal'

/**
 * A critical alert is a solid, full-width band that sits under the header and is not dismissible.
 * role="alert" makes screen readers announce it immediately when it appears.
 */
export const CriticalAlert = ({ alert, savedAt }: { alert: Alert; savedAt?: string | null }) => {
  const titleId = useId()
  const style = severityStyles.critical

  return (
    <section
      id={`alert-${alert.id}`}
      role="alert"
      aria-labelledby={titleId}
      style={{ backgroundColor: style.background, color: style.foreground }}
      className="scroll-mt-4 border-y border-black/10"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 py-4">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-black/20">
          <SeverityIcon severity="critical" className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span
              style={{ color: style.background }}
              className="rounded bg-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
            >
              {style.label}
            </span>
            <span>
              {audienceLabel(alert)} · Started <time dateTime={alert.publishedAt}>{formatTimeOfDay(alert.publishedAt)}</time>
              {savedAt && <> · Saved copy from <time dateTime={savedAt}>{formatTimeOfDay(savedAt)}</time></>}
            </span>
          </p>
          <h2 id={titleId} className="mt-1 text-lg font-bold sm:text-xl">
            {alert.title}
          </h2>
          <p className="mt-1 text-sm sm:text-base">{alert.body}</p>
        </div>
      </div>
    </section>
  )
}
