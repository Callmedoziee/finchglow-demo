import type { SVGProps } from 'react'
import { Icon } from './Icon'

/** Wi-Fi symbol with a slash through it. */
export const OfflineIcon = (props: Omit<SVGProps<SVGSVGElement>, 'children'>) => (
  <Icon {...props}>
    <path d="M2 2l20 20" />
    <path d="M8.5 16.4a5 5 0 0 1 7 0" />
    <path d="M5 12.9a10 10 0 0 1 5.2-2.7" />
    <path d="M19 12.9a10 10 0 0 0-2.2-1.7" />
    <path d="M2 8.8a15 15 0 0 1 4.2-2.7" />
    <path d="M22 8.8a15 15 0 0 0-8.4-3.7" />
    <path d="M12 20h.01" />
  </Icon>
)
