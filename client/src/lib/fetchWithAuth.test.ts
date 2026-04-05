import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWithAuth } from './fetchWithAuth'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchWithAuth', () => {
  it('attaches Bearer token when getToken returns a token', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())
    const getToken = vi.fn().mockResolvedValue('test-token-123')

    await fetchWithAuth('/api/me', {}, getToken)

    expect(mockFetch).toHaveBeenCalledOnce()
    const [, init] = mockFetch.mock.calls[0]
    const headers = init?.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer test-token-123')
  })

  it('does not set Authorization header when getToken returns null', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())
    const getToken = vi.fn().mockResolvedValue(null)

    await fetchWithAuth('/api/me', {}, getToken)

    const [, init] = mockFetch.mock.calls[0]
    const headers = init?.headers as Headers
    expect(headers.get('Authorization')).toBeNull()
  })

  it('does not set Authorization header when getToken is not provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())

    await fetchWithAuth('/api/health')

    const [, init] = mockFetch.mock.calls[0]
    const headers = init?.headers as Headers
    expect(headers.get('Authorization')).toBeNull()
  })

  it('preserves existing headers', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())
    const getToken = vi.fn().mockResolvedValue('token')

    await fetchWithAuth(
      '/api/analyze',
      { headers: { 'Content-Type': 'application/json' } },
      getToken,
    )

    const [, init] = mockFetch.mock.calls[0]
    const headers = init?.headers as Headers
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer token')
  })
})
