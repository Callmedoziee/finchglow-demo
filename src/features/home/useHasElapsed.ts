import { useEffect, useState } from 'react'

/** False at first, then true once `delayMs` has passed. Used to put a time limit on waiting for something. */
export const useHasElapsed = (delayMs: number): boolean => {
  const [hasElapsed, setHasElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHasElapsed(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  return hasElapsed
}
