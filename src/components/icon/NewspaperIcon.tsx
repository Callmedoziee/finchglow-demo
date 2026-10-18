import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Lucide "newspaper" (ISC licence). */
export const NewspaperIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M15 18h-5" />
    <path d="M18 14h-8" />
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <rect width="8" height="4" x="10" y="6" rx="1" />
  </Icon>
)
