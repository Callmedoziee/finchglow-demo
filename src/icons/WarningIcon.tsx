import type { SVGProps } from 'react'
import { Icon } from '@/icons/Icon'

/** Triangle with an exclamation mark. */
export const WarningIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M12 3.5 2.8 19.5h18.4z" />
    <path d="M12 10v4.5M12 17v.3" />
  </Icon>
)
