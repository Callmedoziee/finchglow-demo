import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Lucide "check" (ISC licence). */
export const CheckIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
)
