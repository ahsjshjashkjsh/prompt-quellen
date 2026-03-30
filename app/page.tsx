// app/page.tsx
import Link from 'next/link'
import { listEintraege } from '@/lib/eintraege'

export default async function UebersichtPage() {
  const eintraege = await listEintraege()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">KI-Quellen</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {eintraege.length === 0
              ? 'Noch keine Einträge'
              : `${eintraege.length} Eintrag${eintraege.length !== 1 ? '…e' : ''}`}
          </p>
        </div>
        <Link
          href="/neu"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span className="text-base leading-none">+</span>
          Neuer Eintrag
        </Link>
      </div>

      {/* Empty state */}
      {eintraege.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-slate-600 font-medium">Noch keine Einträge</p>
          <p className="text-slate-400 text-sm mt-1">Erstelle deinen ersten KI-Quellennachweis</p>
          <Link
            href="/neu"
            className="inline-block mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {eintraege.map((e) => (
            <li key={e.id}>
              <Link
                href={`/${e.id}`}
                className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-0.5"></span>
                    <span className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {e.abschnitt}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 bg-slate-50 px-2 py-1 rounded-lg">
                    {new Date(e.erstellt_am).toLocaleDateString('de-AT')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2.5 ml-4 line-clamp-2 leading-relaxed">
                  {e.prompt.slice(0, 140)}{e.prompt.length > 140 ? '…' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
