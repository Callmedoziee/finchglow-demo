import type { Company } from '@/types/portal'

/** The company's logo: a coloured tile with its initials. Decorative, so hidden from screen readers. */
export const CompanyMark = ({ company }: { company: Company }) => (
  <span
    aria-hidden="true"
    className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-sm font-bold tracking-wide text-on-accent"
  >
    {company.mark}
  </span>
)
