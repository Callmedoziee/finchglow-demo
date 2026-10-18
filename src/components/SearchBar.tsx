import { useId } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

/** role="search" makes this a landmark, so screen reader users can jump straight to it. */
export const SearchBar = ({ value, onChange }: Props) => {
  const inputId = useId()

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-muted">
        Search apps and news
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          placeholder="For example: booking, payslips, award"
          className="min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-foreground placeholder:text-muted"
        />
        {value !== '' && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="min-h-11 shrink-0 rounded-lg border border-line bg-surface px-4 font-medium text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  )
}
