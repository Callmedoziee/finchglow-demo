import type { Severity } from '@/types/portal'

export interface SeverityStyle {
  /** Word shown next to the icon, so severity never depends on colour alone. */
  label: string
  background: string
  foreground: string
  border: string
}

/**
 * Colours per severity, kept as data so tests can check their contrast.
 * Critical is a solid, saturated block on purpose: it must be the loudest thing on the page.
 */
export const severityStyles: Record<Severity, SeverityStyle> = {
  critical: { label: 'Critical', background: '#b91c1c', foreground: '#ffffff', border: '#7f1d1d' },
  warning: { label: 'Warning', background: '#fffbeb', foreground: '#451a03', border: '#b45309' },
  information: { label: 'Information', background: '#eff6ff', foreground: '#1e3a8a', border: '#1d4ed8' },
}
