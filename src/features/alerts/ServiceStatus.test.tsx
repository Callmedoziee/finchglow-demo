import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { configureApi } from '@/services/mockApi'
import { renderPortal } from '@/test/renderPortal'

beforeEach(() => configureApi({ delayMs: 0, failureRate: 0 }))

describe('ServiceStatus', () => {
  it('lists what is affected and links to that alert on the page', async () => {
    renderPortal({ companyId: 'ota' })

    const region = await screen.findByRole('region', { name: 'Service status' })
    expect(region).toHaveTextContent('Payments failing')
    expect(region).toHaveTextContent('Affects Booking Engine')
    const link = screen.getAllByRole('link', { name: 'View incident' })[0]
    const target = document.getElementById(link.getAttribute('href')!.slice(1))
    expect(target).not.toBeNull()
  })

  it('gives every View incident link a real target, for critical and non-critical alerts alike', async () => {
    renderPortal({ companyId: 'ota' })
    await screen.findByRole('region', { name: 'Service status' })

    const links = screen.getAllByRole('link', { name: 'View incident' })
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(document.getElementById(link.getAttribute('href')!.slice(1))).not.toBeNull()
    }
  })

  it('shows only the incidents that reach the selected company', async () => {
    renderPortal({ companyId: 'academy' })

    const region = await screen.findByRole('region', { name: 'Service status' })
    expect(region).toHaveTextContent('Payments failing')
    expect(region).not.toHaveTextContent('Slow searches')
  })
})
