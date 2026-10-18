import { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon } from '@/components/icon/CheckIcon'
import { ChevronsUpDownIcon } from '@/components/icon/ChevronsUpDownIcon'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { companies } from '@/configs/companies'
import { useCompany } from './companyContext'

/**
 * A button that opens a small panel of companies (the "disclosure" pattern).
 * Escape closes it and gives focus back to the button; so does clicking outside or tabbing away.
 * Choosing a company closes it and re-themes the page.
 */
export const CompanySwitcher = () => {
  const { company, setCompanyId } = useCompany()
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const closeIfOutside = (event: Event) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeIfOutside)
    document.addEventListener('focusin', closeIfOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeIfOutside)
      document.removeEventListener('focusin', closeIfOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const choose = (id: string) => {
    setCompanyId(id)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-base text-foreground"
      >
        <span className="text-sm font-medium text-muted">Company</span>
        <span className="font-semibold">{company.name}</span>
        <ChevronsUpDownIcon className="size-4 text-muted" />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute left-0 z-20 mt-2 sm:left-auto sm:right-0 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-2 shadow-lg"
        >
          <ul>
            {companies.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  aria-current={option.id === company.id ? 'true' : undefined}
                  onClick={() => choose(option.id)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-canvas"
                >
                  <span
                    className="flex h-9 w-20 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: option.logoBackground }}
                  >
                    <CompanyLogo logo={option.logo} alt="" className="h-5 w-auto max-w-16" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{option.name}</span>
                    <span className="block text-xs text-muted">{option.tagline}</span>
                  </span>
                  {option.id === company.id && <CheckIcon className="size-5 shrink-0 text-accent" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
