// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { logoutAction } from '@/actions/auth'
import { AUTH_COOKIE } from '@/lib/auth'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Prompt-Quellen',
  description: 'KI-Quellennachweis für die Abschlussarbeit',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isLoggedIn = !!cookieStore.get(AUTH_COOKIE)

  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {isLoggedIn && (
          <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg">Prompt-Quellen</a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Abmelden
              </button>
            </form>
          </nav>
        )}
        <main className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
