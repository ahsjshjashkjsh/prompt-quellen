// app/page.tsx
import Link from 'next/link'
import { listEintraege, TYP_META, type EintragKurz } from '@/lib/eintraege'
import { KAPITEL } from '@/lib/kapitel'

const TYP_COLOR: Record<string, { badge: string; dot: string }> = {
  ki:        { badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',   dot: 'bg-indigo-400' },
  literatur: { badge: 'bg-blue-100 text-blue-700 border-blue-200',         dot: 'bg-blue-400' },
  website:   { badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',         dot: 'bg-cyan-400' },
  bild:      { badge: 'bg-violet-100 text-violet-700 border-violet-200',   dot: 'bg-violet-400' },
  sonstige:  { badge: 'bg-slate-100 text-slate-600 border-slate-200',      dot: 'bg-slate-400' },
}

function kapitelLevel(k: string) {
  const m = k.match(/^(\d+(\.\d+)*)/)
  return m ? m[1].split('.').length : 1
}

function SourceRow({ e }: { e: EintragKurz }) {
  const meta = TYP_META[e.typ] ?? TYP_META.sonstige
  const color = TYP_COLOR[e.typ] ?? TYP_COLOR.sonstige
  const label = e.titel || e.prompt || e.url || e.beschreibung || '—'
  return (
    <Link href={`/${e.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border shrink-0 ${color.badge}`}>
        {meta.emoji} {meta.label}
      </span>
      <span className="text-sm text-slate-600 truncate group-hover:text-indigo-600 transition-colors flex-1">
        {label.length > 90 ? label.slice(0, 90) + '…' : label}
      </span>
      <span className="text-xs text-slate-300 shrink-0 hidden sm:block">
        {new Date(e.erstellt_am).toLocaleDateString('de-AT')}
      </span>
    </Link>
  )
}

export default async function UebersichtPage() {
  const eintraege = await listEintraege()

  const grouped: Record<string, EintragKurz[]> = {}
  for (const e of eintraege) {
    if (!grouped[e.abschnitt]) grouped[e.abschnitt] = []
    grouped[e.abschnitt].push(e)
  }

  const kapitelMitEintraegen = KAPITEL.filter((k) => grouped[k])
  const sonstigeKapitel = Object.keys(grouped).filter((k) => !KAPITEL.includes(k))
  const alleKapitel = [...kapitelMitEintraegen, ...sonstigeKapitel]

  // Stats
  const stats = Object.entries(TYP_META).map(([typ, meta]) => ({
    typ, meta, count: eintraege.filter((e) => e.typ === typ).length,
  })).filter((s) => s.count > 0)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quellenübersicht</h1>
          <p className="text-sm text-slate-400 mt-1">
            {eintraege.length} Einträge · {alleKapitel.length} Kapitel
          </p>
        </div>
        <Link href="/neu"
          className="shrink-0 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span> Neue Quelle
        </Link>
      </div>

      {/* Typ-Stats */}
      {stats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {stats.map(({ typ, meta, count }) => (
            <span key={typ} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${TYP_COLOR[typ]?.badge}`}>
              {meta.emoji} {meta.label} <span className="font-bold">{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Leer */}
      {eintraege.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-3xl mb-3">📂</p>
          <p className="text-slate-500 font-medium mb-4">Noch keine Einträge</p>
          <Link href="/neu" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {alleKapitel.map((kapitel) => {
            const quellen = grouped[kapitel]
            const level = kapitelLevel(kapitel)
            const isTop = level === 1
            return (
              <div key={kapitel}
                style={{ marginLeft: `${(level - 1) * 16}px` }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Kapitel-Header */}
                <div className={`flex items-center justify-between px-4 py-2.5 border-b border-slate-100 ${isTop ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                  <span className={`text-sm font-${isTop ? 'bold' : 'semibold'} ${isTop ? 'text-indigo-800' : 'text-slate-700'}`}>
                    {kapitel}
                  </span>
                  <span className="text-xs font-medium bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full ml-3 shrink-0">
                    {quellen.length}
                  </span>
                </div>
                {/* Quellen */}
                <div>
                  {quellen.map((e) => <SourceRow key={e.id} e={e} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
