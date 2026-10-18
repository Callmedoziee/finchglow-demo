import type { ReactNode, SVGProps } from 'react'

interface Props extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  children: ReactNode
}

/**
 * The shared frame for every icon: a 24x24 outline drawn with the surrounding text colour.
 * Decorative by default (aria-hidden), because icons here always sit next to a text label.
 */
export const Icon = ({ children, ...svgProps }: Props) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...svgProps}
  >
    {children}
  </svg>
)
