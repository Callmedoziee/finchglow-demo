import { useState } from 'react'
import { SearchIcon } from '@/components/icon/SearchIcon'
import { SearchPalette } from '@/features/search/components/SearchPalette'
import { isApplePlatform, useSearchShortcut } from '@/features/search/hooks/useSearchShortcut'

/** The search field on the page. It is really a button that opens the palette; Command/Control+K does the same from anywhere. */
export const Search = () => {
  const [isOpen, setIsOpen] = useState(false)
  useSearchShortcut(() => setIsOpen(true))

  return (
    <div role="search">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-line bg-surface px-3 text-left text-base text-muted"
      >
        <SearchIcon className="size-5 shrink-0" />
        <span className="flex-1">Search apps and news</span>
        <kbd className="hidden rounded border border-line px-2 py-0.5 font-sans text-xs sm:inline">
          {isApplePlatform() ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      <SearchPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
