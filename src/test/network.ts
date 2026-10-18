/** Test helper: pretends the device lost or regained its connection. */
export const setOnline = (isOnline: boolean): void => {
  Object.defineProperty(navigator, 'onLine', { value: isOnline, configurable: true })
  window.dispatchEvent(new Event(isOnline ? 'online' : 'offline'))
}
