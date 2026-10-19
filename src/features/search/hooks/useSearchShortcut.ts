import { useEffect, useRef } from 'react'

/** True on Apple devices, where the shortcut is Command+K; elsewhere it is Control+K. Both always work. */
export const isApplePlatform = (): boolean => /Mac|iPhone|iPad/.test(navigator.userAgent)

/** Calls `onTrigger` when the person presses Command+K or Control+K anywhere on the page. */
export const useSearchShortcut = (onTrigger: () => void): void => {
  const onTriggerRef = useRef(onTrigger)

  useEffect(() => {
    onTriggerRef.current = onTrigger
  }, [onTrigger])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        // Browsers use Control+K to focus their own address bar or search box; take it only for this page.
        event.preventDefault()
        onTriggerRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
