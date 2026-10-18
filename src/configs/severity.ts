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
  critical: { label: 'Critical', background: '#b42318', foreground: '#ffffff', border: '#912018' },
  warning: { label: 'Warning', background: '#fff6e5', foreground: '#93370d', border: '#b54708' },
  information: { label: 'Information', background: '#eaf4fb', foreground: '#0b5e9c', border: '#0b5e9c' },
}
