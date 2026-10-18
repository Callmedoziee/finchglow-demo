import type { SVGProps } from 'react'
import { Icon } from '@/icons/Icon'

/** Octagon with an exclamation mark: the "stop" shape. */
export const CriticalIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M8.3 2.5h7.4l5.8 5.8v7.4l-5.8 5.8H8.3l-5.8-5.8V8.3z" />
    <path d="M12 7.5v5.5M12 16.2v.3" />
  </Icon>
)
