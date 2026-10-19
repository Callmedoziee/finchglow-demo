import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  it('starts loading, then returns the data', async () => {
    const load = vi.fn().mockResolvedValue(['ok'])
    const { result } = renderHook(() => useAsync(load))

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ status: 'success', data: ['ok'] })
  })

  it('reports an error, and recovers when reload succeeds', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce('fine')
    const { result } = renderHook(() => useAsync(load))

    await waitFor(() => expect(result.current.status).toBe('error'))

    act(() => result.current.reload())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('ignores an old response that arrives after a newer request was made', async () => {
    let answerFirst: (value: string) => void = () => {}
    const load = vi
      .fn<() => Promise<string>>()
      .mockImplementationOnce(() => new Promise((resolve) => (answerFirst = resolve)))
      .mockResolvedValueOnce('second')
    const { result, rerender } = renderHook(({ loader }) => useAsync(loader), { initialProps: { loader: load } })

    // A new loader function means a new request; the first one is still waiting.
    const loadAgain = vi.fn().mockResolvedValue('second')
    rerender({ loader: loadAgain })
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: 'second' }))

    answerFirst('first, too late')
    await act(() => Promise.resolve())

    expect(result.current).toMatchObject({ status: 'success', data: 'second' })
  })

  it('does not update after the component is gone', async () => {
    let answer: (value: string) => void = () => {}
    const load = vi.fn(() => new Promise<string>((resolve) => (answer = resolve)))
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = renderHook(() => useAsync(load))

    unmount()
    answer('too late')
    await act(() => Promise.resolve())

    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })
})
