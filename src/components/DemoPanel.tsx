import { useState } from 'react'
import { configureApi, getApiBehaviour, type ApiBehaviour } from '@/api/mockApi'
import { requestRefresh } from '@/lib/refreshEvent'

const NORMAL_DELAY_MS = 400
const SLOW_DELAY_MS = 3000

const buttonClass = (isOn: boolean): string =>
  `min-h-11 rounded-lg border px-3 text-sm font-medium ${
    isOn ? 'border-foreground bg-foreground text-surface' : 'border-line bg-surface text-foreground'
  }`

/**
 * Presenter controls for showing failures and slow networks on demand.
 * Only mounted when the address contains ?demo=1 (see App).
 */
export const DemoPanel = () => {
  const [behaviour, setBehaviour] = useState<ApiBehaviour>(getApiBehaviour)

  const change = (changes: Partial<ApiBehaviour>) => {
    configureApi(changes)
    setBehaviour(getApiBehaviour())
  }

  const isFailing = behaviour.failureRate === 1
  const isSlow = behaviour.delayMs > NORMAL_DELAY_MS

  return (
    <aside
      aria-label="Demo controls"
      className="fixed bottom-3 right-3 z-20 flex max-w-[calc(100vw-1.5rem)] flex-col gap-2 rounded-lg border border-line bg-surface p-3 shadow-lg"
    >
      <p className="text-sm font-semibold">Demo controls</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={isFailing}
          onClick={() => change({ failureRate: isFailing ? 0 : 1 })}
          className={buttonClass(isFailing)}
        >
          Simulate failure
        </button>
        <button
          type="button"
          aria-pressed={isSlow}
          onClick={() => change({ delayMs: isSlow ? NORMAL_DELAY_MS : SLOW_DELAY_MS })}
          className={buttonClass(isSlow)}
        >
          Slow network
        </button>
        <button type="button" onClick={requestRefresh} className={buttonClass(false)}>
          Refresh now
        </button>
      </div>
    </aside>
  )
}
