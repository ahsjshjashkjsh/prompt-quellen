// lib/auth.ts
export const AUTH_COOKIE = 'pq_auth'

/**
 * Returns true if the provided password matches the expected password.
 * Both arguments are plain strings — comparison happens server-side only.
 */
export function checkPassword(input: string, expected: string): boolean {
  if (!input || !expected) return false
  return input === expected
}
