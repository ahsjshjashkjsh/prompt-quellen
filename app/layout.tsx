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
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {isLoggedIn && (
          <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PQ</span>
                </div>
                <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  Prompt-Quellen
                </span>
              </a>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </nav>
        )}
        <main className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
