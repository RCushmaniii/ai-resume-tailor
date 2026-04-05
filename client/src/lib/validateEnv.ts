/**
 * Validate VITE_ environment variables at startup.
 * Logs errors for critical missing vars and warnings for optional ones.
 */
export function validateEnv() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical — app won't function without these
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY is not set — auth will not work');
  }

  // Important but has fallback
  if (!import.meta.env.VITE_API_URL) {
    warnings.push('VITE_API_URL not set, falling back to /api');
  }

  // Optional
  if (!import.meta.env.VITE_SENTRY_DSN) {
    warnings.push('VITE_SENTRY_DSN not set — error reporting disabled');
  }
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    warnings.push('VITE_STRIPE_PUBLISHABLE_KEY not set — payments disabled');
  }

  // Report
  warnings.forEach((w) => console.warn(`[ENV] ${w}`));
  errors.forEach((e) => console.error(`[ENV] ${e}`));
}
