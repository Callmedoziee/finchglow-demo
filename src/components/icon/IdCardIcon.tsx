import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Lucide "id-card" (ISC licence). */
export const IdCardIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M13 19a4 4 0 00-8 0" />
    <path d="M16 10h2" />
    <path d="M16 14h2" />
    <circle cx="9" cy="12" r="3" />
    <rect x="2" y="5" width="20" height="14" rx="2" />
  </Icon>
)
