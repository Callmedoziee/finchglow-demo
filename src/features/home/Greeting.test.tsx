import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test/renderPortal'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))
afterEach(() => configureApi({ delayMs: 400, failureRate: 0 }))

const greeting = async () => within(await screen.findByRole('region', { name: /amara/i }))

describe('Greeting', () => {
  it('shows the date, the name, the company, and the role and place', async () => {
    renderPortal()
    const section = await greeting()

    expect(section.getByText(/^\w+day, \d{1,2} \w+$/)).toBeInTheDocument()
    expect(section.getByRole('heading', { level: 1 })).toHaveTextContent(/good (morning|afternoon|evening), amara/i)
    expect(section.getByText('Travelden')).toBeInTheDocument()
    expect(section.getByText(/travel consultant · online sales desk, lagos/i)).toBeInTheDocument()
  })

  it('writes a sentence about the day from the incidents and waiting work, not from fixed text', async () => {
    renderPortal({ companyId: 'ota' })
    const section = await greeting()

    // Two alerts (the payment failure and the slow booking platform) both affect Travelden's Booking Engine.
    expect(
      await section.findByText('2 incidents affect tools you use today, and 3 expense approvals are waiting for you.'),
    ).toBeInTheDocument()
  })

  it('changes the sentence when another company is selected', async () => {
    const user = userEvent.setup()
    renderPortal({ companyId: 'ota' })
    const section = await greeting()
    await section.findByText(/2 incidents affect tools you use today/i)

    await user.selectOptions(screen.getByRole('combobox', { name: /company/i }), 'academy')

    // The Academy has no app affected by an incident, but has its own waiting work.
    expect(await section.findByText('12 attendance sheets and 3 expense approvals are waiting for you.')).toBeInTheDocument()
    expect(section.queryByText(/incident/i)).not.toBeInTheDocument()
  })

  it('says which company is being previewed when it is not the person\'s own', async () => {
    const user = userEvent.setup()
    renderPortal({ companyId: 'ota' })
    const section = await greeting()

    await user.selectOptions(screen.getByRole('combobox', { name: /company/i }), 'tmc')

    expect(await section.findByText('You are viewing FCM Travel Nigeria. You work at Travelden.')).toBeInTheDocument()
  })
})
