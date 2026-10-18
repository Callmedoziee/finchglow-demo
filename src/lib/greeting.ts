/** Picks a greeting from the hour of the day (0 to 23). Pure so it is easy to test. */
export const greetingFor = (hour: number): string => {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
