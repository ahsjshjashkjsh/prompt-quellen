// app/page.tsx
import Link from 'next/link'
import { listEintraege, TYP_META } from '@/lib/eintraege'

const TABS = [
  { id: 'alle',      label: 'Alle' },
  { id: 'ki',        label: '🤖 KI' },
  { id: 'literatur', label: '📚 Literatur' },
  { id: 'website',   label: '🌐 Website' },
  { id: 'bild',      label: '🖼️ Bild' },
  { id: 'sonstige',  label: '📄 Sonstige' },
]

const TYP_BADGE: Record<string, string> = {
  ki:        'bg-indigo-100 text-indigo-700',
  literatur: 'bg-blue-100 text-blue-700',
  website:   'bg-cyan-100 text-cyan-700',
  bild:      'bg-purple-100 text-purple-700',
  sonstige:  'bg-slate-100 text-slate-600',
}

export default async function UebersichtPage({
  searchParams,
}: {
  searchParams: Promise<{ typ?: string }>
}) {
  const { typ } = await searchParams
  const aktiv = typ || 'alle'
  const eintraege = await listEintraege(aktiv)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quellen</h1>
          <p className="text-sm text-slate-500 mt-0.5">{eintraege.length} Eintrag{eintraege.length !== 1 ? '…e' : ''}</p>
        </div>
        <Link
          href="/neu"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span className="text-base leading-none">+</span> Neuer Eintrag
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6 bg-slate-100 p-1 rounded-xl">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === 'alle' ? '/' : `/?typ=${tab.id}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              aktiv === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {eintraege.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 font-medium">Noch keine Einträge</p>
          <Link href="/neu" className="inline-block mt-3 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {eintraege.map((e) => {
            const meta = TYP_META[e.typ] ?? TYP_META.sonstige
            const preview = e.prompt || e.titel || e.url || e.beschreibung || '—'
            return (
              <li key={e.id}>
                <Link
                  href={`/${e.id}`}
                  className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 ${TYP_BADGE[e.typ] ?? TYP_BADGE.sonstige}`}>
                        {meta.emoji} {meta.label}
                      </span>
                      <span className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                        {e.abschnitt}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 bg-slate-50 px-2 py-1 rounded-lg">
                      {new Date(e.erstellt_am).toLocaleDateString('de-AT')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2.5 line-clamp-1 leading-relaxed">
                    {preview.slice(0, 120)}{preview.length > 120 ? '…' : ''}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
