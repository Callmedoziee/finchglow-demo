import type { ComponentType, SVGProps } from 'react'
import { CriticalIcon } from '@/components/icon/CriticalIcon'
import { InformationIcon } from '@/components/icon/InformationIcon'
import { WarningIcon } from '@/components/icon/WarningIcon'
import type { Severity } from '@/types/portal'

const iconBySeverity: Record<Severity, ComponentType<SVGProps<SVGSVGElement>>> = {
  critical: CriticalIcon,
  warning: WarningIcon,
  information: InformationIcon,
}

/** Picks the right icon for a severity. The severity word is always printed beside it. */
export const SeverityIcon = ({ severity, className }: { severity: Severity; className?: string }) => {
  const IconForSeverity = iconBySeverity[severity]
  return <IconForSeverity className={className} />
}
