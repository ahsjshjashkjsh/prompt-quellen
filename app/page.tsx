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
