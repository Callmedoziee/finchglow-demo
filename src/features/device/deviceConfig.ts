export interface SharedDevice {
  /** Where the device lives, shown in the bar. */
  label: string
  /** How long without a tap or key press before the person is signed out. */
  idleMs: number
}

const DEFAULT_IDLE_SECONDS = 5 * 60

/**
 * Is this a shared device, such as a facilities-hub tablet? In production that would come from how the device is
 * set up (device management or the sign-in service). Here the address stands in for it:
 * ?device=shared turns it on, and ?idle=20 (seconds) shortens the timeout so it can be shown in a demo.
 */
export const getSharedDevice = (search: string = window.location.search): SharedDevice | null => {
  const params = new URLSearchParams(search)
  if (params.get('device') !== 'shared') return null

  const requestedSeconds = Number(params.get('idle'))
  const idleSeconds = Number.isInteger(requestedSeconds) && requestedSeconds > 0 ? requestedSeconds : DEFAULT_IDLE_SECONDS
  return { label: 'Ikeja facilities hub', idleMs: idleSeconds * 1000 }
}
