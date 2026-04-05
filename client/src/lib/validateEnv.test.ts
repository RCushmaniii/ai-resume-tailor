import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('validateEnv', () => {
  it('errors when VITE_CLERK_PUBLISHABLE_KEY is missing', async () => {
    vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', '')
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000/api')
    vi.stubEnv('VITE_SENTRY_DSN', 'https://dsn.sentry.io')
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test')

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Dynamic import to pick up stubbed env
    const { validateEnv } = await import('./validateEnv')
    validateEnv()

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('VITE_CLERK_PUBLISHABLE_KEY'),
    )
  })

  it('warns when VITE_SENTRY_DSN is missing', async () => {
    vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test')
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000/api')
    vi.stubEnv('VITE_SENTRY_DSN', '')
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test')

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { validateEnv } = await import('./validateEnv')
    validateEnv()

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('VITE_SENTRY_DSN'),
    )
  })

  it('does not warn when all vars are set', async () => {
    vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test')
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000/api')
    vi.stubEnv('VITE_SENTRY_DSN', 'https://dsn.sentry.io')
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test')

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { validateEnv } = await import('./validateEnv')
    validateEnv()

    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
