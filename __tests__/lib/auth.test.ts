// __tests__/lib/auth.test.ts
import { checkPassword, AUTH_COOKIE } from '@/lib/auth'

describe('checkPassword', () => {
  it('returns true when password matches', () => {
    expect(checkPassword('geheim123', 'geheim123')).toBe(true)
  })

  it('returns false when password does not match', () => {
    expect(checkPassword('falsch', 'geheim123')).toBe(false)
  })

  it('returns false for empty input', () => {
    expect(checkPassword('', 'geheim123')).toBe(false)
  })
})

describe('AUTH_COOKIE', () => {
  it('is a non-empty string', () => {
    expect(typeof AUTH_COOKIE).toBe('string')
    expect(AUTH_COOKIE.length).toBeGreaterThan(0)
  })
})
