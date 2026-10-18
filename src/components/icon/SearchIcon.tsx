import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Lucide "search" (ISC licence). */
export const SearchIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
)
