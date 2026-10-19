import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { SearchIcon } from '@/components/icon/SearchIcon'
import { useCompany } from '@/context/companyContext'
import { SearchResults } from './SearchResults'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

const SEARCH_DELAY_MS = 250

const PaletteBody = ({ onClose }: { onClose: () => void }) => {
  const { company } = useCompany()
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DELAY_MS)
  // Emptying the box clears the results straight away; only typing waits for the pause.
  const activeQuery = query.trim() === '' ? '' : debouncedQuery

  // Arrow keys move focus between the search box and the results. Every result is a real link,
  // so Enter opens it, Tab still works, and screen readers need no special roles.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const container = containerRef.current
    if (!container) return
    const stops = [container.querySelector('input'), ...container.querySelectorAll('a[data-result]')].filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    )
    const current = stops.indexOf(document.activeElement as HTMLElement)
    const next = Math.min(Math.max(current + (event.key === 'ArrowDown' ? 1 : -1), 0), stops.length - 1)
    event.preventDefault()
    stops[next]?.focus()
  }

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className="flex max-h-[80dvh] flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4">
        <SearchIcon className="size-5 shrink-0 text-muted" />
        <input
          type="text"
          role="searchbox"
          aria-label="Search apps and news"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          placeholder="Search apps and news"
          className="min-h-14 min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted focus-visible:-outline-offset-2"
        />
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 shrink-0 rounded-lg border border-line px-3 text-sm font-medium text-muted"
        >
          Close <kbd className="font-sans">Esc</kbd>
        </button>
      </div>

      {activeQuery === '' ? (
        <p role="status" className="px-4 py-8 text-center text-sm text-muted">
          Type to search apps and news in {company.name} and group-wide.
        </p>
      ) : (
        <SearchResults key={`${company.id}:${activeQuery}`} query={activeQuery} onNavigate={onClose} />
      )}

      <p className="hidden border-t border-border bg-canvas px-4 py-2 text-xs text-muted sm:block">
        <kbd className="font-sans">↑↓</kbd> Move · <kbd className="font-sans">Enter</kbd> Open · <kbd className="font-sans">Esc</kbd> Close
      </p>
    </div>
  )
}

/**
 * A native <dialog> opened with showModal(): the browser itself traps focus inside, makes the page behind it inert,
 * closes on Escape, and returns focus to the button that opened it. The body is only mounted while open,
 * so every opening starts with an empty box.
 */
export const SearchPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search"
      onClose={onClose}
      onClick={(event) => {
        // A click on the dimmed backdrop lands on the dialog element itself, not on its content.
        if (event.target === event.currentTarget) onClose()
      }}
      className="mx-auto mb-auto mt-[8dvh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/40"
    >
      {isOpen && <PaletteBody onClose={onClose} />}
    </dialog>
  )
}
