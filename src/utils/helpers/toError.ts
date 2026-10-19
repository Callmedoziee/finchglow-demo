/** Turns anything that was thrown into a real Error with a readable message. */
export const toError = (value: unknown): Error => {
  if (value instanceof Error) return value
  if (typeof value === 'string') return new Error(value)
  try {
    return new Error(JSON.stringify(value) ?? 'Unknown error')
  } catch {
    return new Error('Unknown error')
  }
}
