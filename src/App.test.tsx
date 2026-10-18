import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/api/mockApi'
import App from './App'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

describe('App shell', () => {
  it('shows a loading message, then greets the employee', async () => {
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)

    expect(await screen.findByRole('heading', { level: 1, name: /amara/i })).toBeInTheDocument()
    expect(screen.getByText('You work at Finchglow Travel.')).toBeInTheDocument()
  })

  it('re-themes and updates the page when another company is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    const switcher = await screen.findByRole('combobox', { name: /company/i })

    await user.selectOptions(switcher, 'Finchglow Academy')

    expect(screen.getByText(/you are viewing finchglow academy/i)).toBeInTheDocument()
    await waitFor(() => expect(document.documentElement.dataset.company).toBe('academy'))
    expect(document.documentElement.style.getPropertyValue('--color-accent')).toBe('#1d4ed8')
  })

  it('shows an error with a Retry button when the API fails, and recovers', async () => {
    configureApi({ failureRate: 1 })
    const user = userEvent.setup()
    render(<App />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/could not be reached/i)

    configureApi({ failureRate: 0 })
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(<App />)
    await screen.findByRole('heading', { level: 1 })
    expect(await axe(container)).toHaveNoViolations()
  })
})
