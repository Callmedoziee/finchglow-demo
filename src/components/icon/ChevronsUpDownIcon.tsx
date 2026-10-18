import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Lucide "chevrons-up-down" (ISC licence). */
export const ChevronsUpDownIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </Icon>
)
