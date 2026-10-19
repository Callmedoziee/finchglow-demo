import { useIdleSignOut } from '@/features/device/hooks/useIdleSignOut'
import type { SharedDevice } from '@/features/device/helpers/deviceConfig'

interface Props {
  device: SharedDevice
  firstName: string
  onSignOut: () => void
}

const describeTimeout = (idleMs: number): string => {
  const minutes = idleMs / 60_000
  return Number.isInteger(minutes) ? `${minutes} minute${minutes === 1 ? '' : 's'}` : `${Math.round(idleMs / 1000)} seconds`
}

/**
 * Shown only on a shared device. It says so, offers "Not <name>? Sign out", and signs the person out after
 * a period of inactivity, with a warning and a "Stay signed in" button first (people need a chance to extend a timeout).
 * The region is a status region, so the warning is announced politely.
 */
export const SharedDeviceBar = ({ device, firstName, onSignOut }: Props) => {
  const { secondsLeft, stay } = useIdleSignOut({ idleMs: device.idleMs, onTimeout: onSignOut })

  return (
    <div role="status" className="border-b border-border bg-success-soft text-success">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <p className="w-full text-sm font-medium sm:w-auto sm:min-w-0 sm:flex-1">
          {secondsLeft === null
            ? `Shared tablet · ${device.label}. You will be signed out after ${describeTimeout(device.idleMs)} of inactivity.`
            : `Signing you out in ${secondsLeft} seconds because nobody is using this tablet.`}
        </p>
        {secondsLeft !== null && (
          <button
            type="button"
            onClick={stay}
            className="min-h-11 rounded-lg border border-success bg-surface px-4 text-sm font-semibold text-success"
          >
            Stay signed in
          </button>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className="min-h-11 rounded-lg bg-success px-4 text-sm font-semibold text-white"
        >
          {`Not ${firstName}? Sign out`}
        </button>
      </div>
    </div>
  )
}
