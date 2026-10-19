import { useCallback, useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
/** How long before the end the person is warned, so the timeout is never a surprise. */
const WARNING_MS = 30_000

/**
 * Counts how long it has been since the last tap, key press or scroll. Near the end it reports secondsLeft
 * (so the screen can warn and offer "Stay signed in"); at the end it calls onTimeout once.
 * Moving the mouse does not count, because a mouse can brush a table without anyone being there.
 */
export const useIdleSignOut = ({ idleMs, onTimeout }: { idleMs: number; onTimeout: () => void }) => {
  const lastActivity = useRef(0)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  const stay = useCallback(() => {
    lastActivity.current = Date.now()
    setSecondsLeft(null)
  }, [])

  useEffect(() => {
    lastActivity.current = Date.now()
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, stay, { passive: true }))

    const timer = setInterval(() => {
      const idleFor = Date.now() - lastActivity.current
      if (idleFor >= idleMs) {
        clearInterval(timer)
        onTimeoutRef.current()
      } else if (idleFor >= idleMs - Math.min(WARNING_MS, idleMs / 2)) {
        setSecondsLeft(Math.ceil((idleMs - idleFor) / 1000))
      }
    }, 1000)

    return () => {
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, stay))
      clearInterval(timer)
    }
  }, [idleMs, stay])

  return { secondsLeft, stay }
}
