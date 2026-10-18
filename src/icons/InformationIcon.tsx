import type { SVGProps } from 'react'
import { Icon } from '@/icons/Icon'

/** Circle with an "i". */
export const InformationIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 11v5.5M12 7.7v.3" />
  </Icon>
)
