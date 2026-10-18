import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { SharedDeviceBar } from './SharedDeviceBar'

const device = { label: 'Ikeja facilities hub', idleMs: 60_000 }

const renderBar = (onSignOut = vi.fn()) => {
  render(<SharedDeviceBar device={device} firstName="Amara" onSignOut={onSignOut} />)
  return onSignOut
}
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('SharedDeviceBar', () => {
  it('says it is a shared tablet and how long until sign-out', () => {
    renderBar()

    expect(screen.getByRole('status')).toHaveTextContent('Shared tablet · Ikeja facilities hub')
    expect(screen.getByRole('status')).toHaveTextContent('after 1 minute of inactivity')
  })

  it('signs out when the person presses Not <name>', () => {
    const onSignOut = renderBar()

    fireEvent.click(screen.getByRole('button', { name: 'Not Amara? Sign out' }))

    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it('warns 30 seconds before the end and counts down', () => {
    renderBar()
    wait(29_000)
    expect(screen.queryByRole('button', { name: 'Stay signed in' })).not.toBeInTheDocument()

    wait(2_000)

    expect(screen.getByRole('status')).toHaveTextContent('Signing you out in 29 seconds')
    expect(screen.getByRole('button', { name: 'Stay signed in' })).toBeInTheDocument()
  })

  it('signs out once, at the end of the idle time', () => {
    const onSignOut = renderBar()
    wait(59_000)
    expect(onSignOut).not.toHaveBeenCalled()

    wait(5_000)

    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it('starts the count again after Stay signed in', () => {
    const onSignOut = renderBar()
    wait(40_000)

    fireEvent.click(screen.getByRole('button', { name: 'Stay signed in' }))
    wait(25_000)

    expect(onSignOut).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Stay signed in' })).not.toBeInTheDocument()
  })

  it('counts a tap or key press as activity, but not a mouse move', () => {
    const onSignOut = renderBar()
    wait(40_000)

    fireEvent.pointerMove(document.body)
    wait(1_000)
    expect(screen.getByRole('button', { name: 'Stay signed in' })).toBeInTheDocument()

    fireEvent.keyDown(document.body, { key: 'a' })
    wait(1_000)
    expect(screen.queryByRole('button', { name: 'Stay signed in' })).not.toBeInTheDocument()
    expect(onSignOut).not.toHaveBeenCalled()
  })

  it('stops counting when the bar goes away', () => {
    const onSignOut = vi.fn()
    const { unmount } = render(<SharedDeviceBar device={device} firstName="Amara" onSignOut={onSignOut} />)
    unmount()

    wait(120_000)

    expect(onSignOut).not.toHaveBeenCalled()
  })

  it('has no automatically detectable accessibility violations', async () => {
    vi.useRealTimers()
    const { container } = render(<SharedDeviceBar device={device} firstName="Amara" onSignOut={() => {}} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
