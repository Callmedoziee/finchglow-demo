import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import App from '@/App'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => {
  configureApi({ delayMs: 400, failureRate: 0 })
  window.history.pushState({}, '', '/')
})

const savedKeys = () => Object.keys(localStorage).filter((key) => key.startsWith('finchglow-portal:'))

describe('Shared device sign-out', () => {
  it('shows no shared-device bar on a personal device', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1, name: /amara/i })

    expect(screen.queryByText(/shared tablet/i)).not.toBeInTheDocument()
  })

  it('signs out, removes the saved copies, and shows the signed-out screen', async () => {
    window.history.pushState({}, '', '/?device=shared')
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText(/shared tablet/i)
    await waitFor(() => expect(savedKeys().length).toBeGreaterThan(0))

    await user.click(screen.getByRole('button', { name: /not amara\? sign out/i }))

    expect(screen.getByRole('heading', { name: /you have been signed out/i })).toBeInTheDocument()
    expect(savedKeys()).toEqual([])
    // Nothing quietly saves again afterwards.
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)))
    expect(savedKeys()).toEqual([])
  })
})
