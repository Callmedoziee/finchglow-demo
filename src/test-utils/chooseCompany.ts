import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

/** Does what a person does: open the company switcher, then pick a company by its name. */
export const chooseCompany = async (user: UserEvent, companyName: string) => {
  await user.click(screen.getByRole('button', { name: /^company/i }))
  await user.click(screen.getByRole('button', { name: new RegExp(`^${companyName}`) }))
}
