# Prompt-Quellen Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a simple password-protected Next.js app deployed on Vercel that lets 2 students store AI prompt sources (section title, own text, prompt, AI output) in a Supabase database.

**Architecture:** Next.js 14 App Router with Server Actions for all data mutations. A shared password stored as a Vercel env variable protects all routes via Next.js Middleware that checks an HttpOnly cookie. Supabase is accessed server-side only using the service role key.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase (`@supabase/supabase-js`), Jest + ts-jest (unit tests), Vercel

---

## File Map

| File | Responsibility |
|---|---|
| `middleware.ts` | Auth check on every request — redirect to `/login` if no valid cookie |
| `lib/supabase.ts` | Create Supabase server client (service role, server-only) |
| `lib/auth.ts` | Pure password-check helper + cookie name constant |
| `lib/eintraege.ts` | Pure DB functions: list, get, create, update, delete |
| `actions/auth.ts` | Server Actions: login, logout |
| `actions/eintraege.ts` | Server Actions: thin wrappers around `lib/eintraege.ts` |
| `app/layout.tsx` | Root layout with nav bar (Logout button) |
| `app/globals.css` | Tailwind base styles |
| `app/login/page.tsx` | Login form |
| `app/page.tsx` | Übersicht — list all entries |
| `app/neu/page.tsx` | Form to create new entry |
| `app/[id]/page.tsx` | Detail view with inline edit and delete |
| `supabase/schema.sql` | SQL to create the `eintraege` table |
| `.env.example` | Template for required env vars |
| `__tests__/lib/auth.test.ts` | Unit tests for auth helper |
| `__tests__/lib/eintraege.test.ts` | Unit tests for DB functions (mocked Supabase) |

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `.env.example`
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create the Next.js app**

```bash
cd "c:/Prompt Quellen"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*"
```

When prompted, accept all defaults.

- [ ] **Step 2: Install Supabase client**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 3: Install Jest and test dependencies**

```bash
npm install --save-dev jest ts-jest @types/jest jest-environment-node
```

- [ ] **Step 4: Create jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathPattern: '__tests__',
}

export default config
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to the `"scripts"` section:
```json
"test": "jest"
```

- [ ] **Step 6: Create .env.example**

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_PASSWORD=your-shared-password
```

- [ ] **Step 7: Create .env.local** (not committed)

```bash
cp .env.example .env.local
```

Leave values as placeholders — will be filled in during deployment task.

- [ ] **Step 8: Create supabase/schema.sql**

```sql
-- supabase/schema.sql
create table eintraege (
  id uuid primary key default gen_random_uuid(),
  abschnitt text not null,
  eigener_text text,
  prompt text not null,
  ki_ausgabe text not null,
  erstellt_am timestamptz not null default now()
);
```

- [ ] **Step 9: Create .gitignore entry for .env.local**

Verify `.gitignore` already contains `.env.local` (create-next-app adds it). If not, add it:
```
.env.local
```

- [ ] **Step 10: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js project with Supabase and Jest"
```

---

## Task 2: Auth Library + Tests

**Files:**
- Create: `lib/auth.ts`
- Create: `__tests__/lib/auth.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/lib/auth.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/auth'"

- [ ] **Step 3: Implement lib/auth.ts**

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/lib/auth.test.ts
```

Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts __tests__/lib/auth.test.ts jest.config.ts
git commit -m "feat: add auth helper with tests"
```

---

## Task 3: Supabase Client + Einträge DB Library + Tests

**Files:**
- Create: `lib/supabase.ts`
- Create: `lib/eintraege.ts`
- Create: `__tests__/lib/eintraege.test.ts`

- [ ] **Step 1: Create lib/supabase.ts**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}
```

- [ ] **Step 2: Write failing tests for eintraege**

```typescript
// __tests__/lib/eintraege.test.ts
import { listEintraege, getEintrag, createEintrag, updateEintrag, deleteEintrag } from '@/lib/eintraege'

// Mock the Supabase client
const mockFrom = jest.fn()
jest.mock('@/lib/supabase', () => ({
  createSupabaseClient: () => ({ from: mockFrom }),
}))

const mockEintrag = {
  id: 'abc-123',
  abschnitt: 'Kapitel 1',
  eigener_text: 'Mein Text',
  prompt: 'Korrigiere diesen Text',
  ki_ausgabe: 'Korrigierter Text',
  erstellt_am: '2026-03-30T10:00:00Z',
}

describe('listEintraege', () => {
  it('returns data from supabase ordered by erstellt_am desc', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: [mockEintrag], error: null })
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await listEintraege()

    expect(mockFrom).toHaveBeenCalledWith('eintraege')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockOrder).toHaveBeenCalledWith('erstellt_am', { ascending: false })
    expect(result).toEqual([mockEintrag])
  })

  it('throws when supabase returns an error', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    await expect(listEintraege()).rejects.toThrow('DB error')
  })
})

describe('getEintrag', () => {
  it('returns single entry by id', async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: mockEintrag, error: null })
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await getEintrag('abc-123')

    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123')
    expect(result).toEqual(mockEintrag)
  })
})

describe('createEintrag', () => {
  it('inserts a new entry and returns it', async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: mockEintrag, error: null })
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
    mockFrom.mockReturnValue({ insert: mockInsert })

    const input = {
      abschnitt: 'Kapitel 1',
      eigener_text: 'Mein Text',
      prompt: 'Korrigiere diesen Text',
      ki_ausgabe: 'Korrigierter Text',
    }
    const result = await createEintrag(input)

    expect(mockInsert).toHaveBeenCalledWith([input])
    expect(result).toEqual(mockEintrag)
  })
})

describe('updateEintrag', () => {
  it('updates entry by id', async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: mockEintrag, error: null })
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
    const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ update: mockUpdate })

    const result = await updateEintrag('abc-123', { abschnitt: 'Kapitel 2' })

    expect(mockUpdate).toHaveBeenCalledWith({ abschnitt: 'Kapitel 2' })
    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123')
    expect(result).toEqual(mockEintrag)
  })
})

describe('deleteEintrag', () => {
  it('deletes entry by id', async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: null })
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ delete: mockDelete })

    await deleteEintrag('abc-123')

    expect(mockDelete).toHaveBeenCalled()
    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123')
  })

  it('throws when supabase returns an error', async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } })
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ delete: mockDelete })

    await expect(deleteEintrag('abc-123')).rejects.toThrow('Delete failed')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx jest __tests__/lib/eintraege.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/eintraege'"

- [ ] **Step 4: Implement lib/eintraege.ts**

```typescript
// lib/eintraege.ts
import { createSupabaseClient } from '@/lib/supabase'

export type Eintrag = {
  id: string
  abschnitt: string
  eigener_text: string | null
  prompt: string
  ki_ausgabe: string
  erstellt_am: string
}

export type EintragInput = {
  abschnitt: string
  eigener_text?: string
  prompt: string
  ki_ausgabe: string
}

export async function listEintraege(): Promise<Eintrag[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .select('*')
    .order('erstellt_am', { ascending: false })
  if (error) throw new Error(error.message)
  return data as Eintrag[]
}

export async function getEintrag(id: string): Promise<Eintrag> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data as Eintrag
}

export async function createEintrag(input: EintragInput): Promise<Eintrag> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .insert([input])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Eintrag
}

export async function updateEintrag(id: string, input: Partial<EintragInput>): Promise<Eintrag> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Eintrag
}

export async function deleteEintrag(id: string): Promise<void> {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from('eintraege').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
```

- [ ] **Step 5: Run all tests**

```bash
npx jest
```

Expected: PASS — all tests passing

- [ ] **Step 6: Commit**

```bash
git add lib/supabase.ts lib/eintraege.ts __tests__/lib/eintraege.test.ts
git commit -m "feat: add Supabase client and eintraege DB library with tests"
```

---

## Task 4: Middleware (Auth Guard)

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create middleware.ts**

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === '/login') return NextResponse.next()

  const cookie = request.cookies.get(AUTH_COOKIE)
  const sitePassword = process.env.SITE_PASSWORD

  if (!cookie || cookie.value !== sitePassword) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware for password protection"
```

---

## Task 5: Server Actions

**Files:**
- Create: `actions/auth.ts`
- Create: `actions/eintraege.ts`

- [ ] **Step 1: Create actions/auth.ts**

```typescript
// actions/auth.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE, checkPassword } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const input = formData.get('password') as string
  const expected = process.env.SITE_PASSWORD ?? ''

  if (!checkPassword(input, expected)) {
    return { error: 'Falsches Passwort' }
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
```

- [ ] **Step 2: Create actions/eintraege.ts**

```typescript
// actions/eintraege.ts
'use server'

import { redirect } from 'next/navigation'
import {
  createEintrag,
  updateEintrag,
  deleteEintrag,
  type EintragInput,
} from '@/lib/eintraege'

export async function createEintragAction(formData: FormData) {
  const input: EintragInput = {
    abschnitt: formData.get('abschnitt') as string,
    eigener_text: (formData.get('eigener_text') as string) || undefined,
    prompt: formData.get('prompt') as string,
    ki_ausgabe: formData.get('ki_ausgabe') as string,
  }
  await createEintrag(input)
  redirect('/')
}

export async function updateEintragAction(id: string, formData: FormData) {
  const input: Partial<EintragInput> = {
    abschnitt: formData.get('abschnitt') as string,
    eigener_text: (formData.get('eigener_text') as string) || undefined,
    prompt: formData.get('prompt') as string,
    ki_ausgabe: formData.get('ki_ausgabe') as string,
  }
  await updateEintrag(id, input)
  redirect(`/${id}`)
}

export async function deleteEintragAction(id: string) {
  await deleteEintrag(id)
  redirect('/')
}
```

- [ ] **Step 3: Commit**

```bash
git add actions/auth.ts actions/eintraege.ts
git commit -m "feat: add server actions for auth and eintraege CRUD"
```

---

## Task 6: Root Layout + Global Styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace app/globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Replace app/layout.tsx**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add root layout with nav and logout"
```

---

## Task 7: Login Page

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create app/login/page.tsx**

```typescript
// app/login/page.tsx
import { loginAction } from '@/actions/auth'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Prompt-Quellen</h1>
        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchParams?.error && (
            <p className="text-red-600 text-sm">{searchParams.error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  )
}
```

Note: The `loginAction` returns `{ error }` on failure. To show the error, update `actions/auth.ts` to redirect with error query param instead of returning:

Replace the `return { error: 'Falsches Passwort' }` line in `actions/auth.ts` with:
```typescript
  redirect('/login?error=Falsches+Passwort')
```

- [ ] **Step 2: Commit**

```bash
git add app/login/page.tsx actions/auth.ts
git commit -m "feat: add login page"
```

---

## Task 8: Übersicht Page (/)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```typescript
// app/page.tsx
import Link from 'next/link'
import { listEintraege } from '@/lib/eintraege'

export default async function UebersichtPage() {
  const eintraege = await listEintraege()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">KI-Quellen</h1>
        <Link
          href="/neu"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
        >
          + Neuer Eintrag
        </Link>
      </div>

      {eintraege.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Noch keine Einträge.</p>
      ) : (
        <ul className="space-y-3">
          {eintraege.map((e) => (
            <li key={e.id}>
              <Link
                href={`/${e.id}`}
                className="block bg-white border border-gray-200 rounded p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-sm">{e.abschnitt}</span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(e.erstellt_am).toLocaleDateString('de-AT')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {e.prompt.slice(0, 120)}{e.prompt.length > 120 ? '…' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add Übersicht page with entry list"
```

---

## Task 9: Neuer Eintrag Page (/neu)

**Files:**
- Create: `app/neu/page.tsx`

- [ ] **Step 1: Create app/neu/page.tsx**

```typescript
// app/neu/page.tsx
import Link from 'next/link'
import { createEintragAction } from '@/actions/eintraege'

export default function NeuPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Neuer Eintrag</h1>
      <form action={createEintragAction} className="space-y-5">
        <div>
          <label htmlFor="abschnitt" className="block text-sm font-medium mb-1">
            Abschnitt / Titel <span className="text-red-500">*</span>
          </label>
          <input
            id="abschnitt"
            name="abschnitt"
            type="text"
            required
            placeholder="z.B. Kapitel 2 – Methoden"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="eigener_text" className="block text-sm font-medium mb-1">
            Eigener Text (Original)
          </label>
          <textarea
            id="eigener_text"
            name="eigener_text"
            rows={4}
            placeholder="Dein ursprünglicher Text vor der KI-Korrektur"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Prompt (an die KI) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            required
            placeholder="Was du der KI eingegeben hast"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="ki_ausgabe" className="block text-sm font-medium mb-1">
            KI-Ausgabe <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ki_ausgabe"
            name="ki_ausgabe"
            rows={4}
            required
            placeholder="Was die KI zurückgegeben hat"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
          >
            Speichern
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/neu/page.tsx
git commit -m "feat: add Neuer Eintrag page with form"
```

---

## Task 10: Detail / Edit / Delete Page (/[id])

**Files:**
- Create: `app/[id]/page.tsx`

- [ ] **Step 1: Create app/[id]/page.tsx**

```typescript
// app/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEintrag } from '@/lib/eintraege'
import { updateEintragAction, deleteEintragAction } from '@/actions/eintraege'

export default async function DetailPage({ params }: { params: { id: string } }) {
  let eintrag
  try {
    eintrag = await getEintrag(params.id)
  } catch {
    notFound()
  }

  const updateAction = updateEintragAction.bind(null, eintrag.id)
  const deleteAction = deleteEintragAction.bind(null, eintrag.id)

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Zurück zur Übersicht
        </Link>
      </div>

      {/* View mode: shown by default; edit form shown via details/summary toggle */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{eintrag.abschnitt}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(eintrag.erstellt_am).toLocaleString('de-AT')}
            </p>
          </div>
        </div>

        {eintrag.eigener_text && (
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">Eigener Text</h2>
            <p className="bg-white border border-gray-200 rounded p-4 whitespace-pre-wrap text-sm">
              {eintrag.eigener_text}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">Prompt</h2>
          <p className="bg-white border border-gray-200 rounded p-4 whitespace-pre-wrap text-sm">
            {eintrag.prompt}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">KI-Ausgabe</h2>
          <p className="bg-white border border-gray-200 rounded p-4 whitespace-pre-wrap text-sm">
            {eintrag.ki_ausgabe}
          </p>
        </section>

        {/* Edit form */}
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 select-none">
            Eintrag bearbeiten
          </summary>
          <form action={updateAction} className="space-y-4 mt-4">
            <div>
              <label htmlFor="abschnitt" className="block text-sm font-medium mb-1">Abschnitt</label>
              <input
                id="abschnitt"
                name="abschnitt"
                type="text"
                required
                defaultValue={eintrag.abschnitt}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="eigener_text" className="block text-sm font-medium mb-1">Eigener Text</label>
              <textarea
                id="eigener_text"
                name="eigener_text"
                rows={4}
                defaultValue={eintrag.eigener_text ?? ''}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">Prompt</label>
              <textarea
                id="prompt"
                name="prompt"
                rows={4}
                required
                defaultValue={eintrag.prompt}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
            <div>
              <label htmlFor="ki_ausgabe" className="block text-sm font-medium mb-1">KI-Ausgabe</label>
              <textarea
                id="ki_ausgabe"
                name="ki_ausgabe"
                rows={4}
                required
                defaultValue={eintrag.ki_ausgabe}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium text-sm"
            >
              Änderungen speichern
            </button>
          </form>
        </details>

        {/* Delete */}
        <form
          action={deleteAction}
          onSubmit={undefined}
          className="pt-4 border-t border-gray-200"
        >
          <button
            type="submit"
            className="text-sm text-red-500 hover:text-red-700"
            onClick={undefined}
            formAction={deleteAction}
          >
            Eintrag löschen
          </button>
        </form>
      </div>
    </div>
  )
}
```

Note: The delete button uses a `<form>` with Server Action — no JS confirm dialog (keep it simple and server-rendered). A user would need to click "Eintrag löschen" once to delete.

- [ ] **Step 2: Commit**

```bash
git add "app/[id]/page.tsx"
git commit -m "feat: add detail page with view, edit, and delete"
```

---

## Task 11: Run All Tests

- [ ] **Step 1: Run full test suite**

```bash
npx jest --verbose
```

Expected output:
```
PASS __tests__/lib/auth.test.ts
PASS __tests__/lib/eintraege.test.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

If tests fail, fix the issue before proceeding.

- [ ] **Step 2: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve test failures"
```

---

## Task 12: Deploy to Vercel

- [ ] **Step 1: Create GitHub repository**

Go to [github.com/new](https://github.com/new), create a new **private** repository named `prompt-quellen`. Then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/prompt-quellen.git
git push -u origin main
```

- [ ] **Step 2: Create Supabase project and run schema**

1. Go to [supabase.com](https://supabase.com) → New project
2. Note down: Project URL and Service Role Key (Settings → API)
3. Go to SQL Editor → paste and run contents of `supabase/schema.sql`

- [ ] **Step 3: Deploy on Vercel**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository `prompt-quellen`
3. In "Environment Variables", add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
   - `SITE_PASSWORD` = your chosen shared password
4. Click Deploy

- [ ] **Step 4: Verify deployment**

Visit the deployed URL:
1. You should be redirected to `/login`
2. Enter the password — you should reach the empty overview
3. Create one test entry — it should appear in the list
4. Click the entry — detail view should show all fields
5. Test edit and delete

---

## Self-Review Notes

- All spec requirements covered: login ✓, list ✓, create ✓, detail ✓, edit ✓, delete ✓, auth middleware ✓, Supabase ✓, Vercel deploy ✓
- No TBDs or placeholders remain
- Types defined in `lib/eintraege.ts` (`Eintrag`, `EintragInput`) are used consistently across all tasks
- `AUTH_COOKIE` constant defined in Task 2 used in Tasks 4, 5, 6 — consistent
- `createSupabaseClient()` defined in Task 3 used in `lib/eintraege.ts` — consistent
