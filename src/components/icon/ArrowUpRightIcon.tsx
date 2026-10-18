import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Lucide "arrow-up-right" (ISC licence). */
export const ArrowUpRightIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </Icon>
)
