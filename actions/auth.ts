'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE, checkPassword } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const input = formData.get('password') as string
  const expected = process.env.SITE_PASSWORD ?? ''

  if (!checkPassword(input, expected)) {
    redirect('/login?error=Falsches+Passwort')
  }

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  redirect('/')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  redirect('/login')
}
