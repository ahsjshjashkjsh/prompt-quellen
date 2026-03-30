// app/page.tsx
import Link from 'next/link'
import { listEintraege, TYP_META } from '@/lib/eintraege'
import { KAPITEL } from '@/lib/kapitel'

const TYP_BADGE: Record<string, string> = {
  ki:        'bg-indigo-100 text-indigo-700',
  literatur: 'bg-blue-100 text-blue-700',
  website:   'bg-cyan-100 text-cyan-700',
  bild:      'bg-purple-100 text-purple-700',
  sonstige:  'bg-slate-100 text-slate-600',
}

export default async function UebersichtPage() {
  const eintraege = await listEintraege()

  // Gruppieren nach Kapitel (in Reihenfolge des Inhaltsverzeichnisses)
  const grouped: Record<string, typeof eintraege> = {}
  for (const e of eintraege) {
    if (!grouped[e.abschnitt]) grouped[e.abschnitt] = []
    grouped[e.abschnitt].push(e)
  }

  // Kapitel die tatsächlich Einträge haben, in Inhaltsverzeichnis-Reihenfolge
  const kapitelMitEintraegen = KAPITEL.filter((k) => grouped[k])
  // Kapitel die nicht im Inhaltsverzeichnis stehen (falls manuell eingegeben)
  const sonstigeKapitel = Object.keys(grouped).filter((k) => !KAPITEL.includes(k))

  const alleKapitel = [...kapitelMitEintraegen, ...sonstigeKapitel]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quellen</h1>
          <p className="text-sm text-slate-500 mt-0.5">{eintraege.length} Eintrag{eintraege.length !== 1 ? 'räge' : ''} in {alleKapitel.length} Kapitel{alleKapitel.length !== 1 ? 'n' : ''}</p>
        </div>
        <Link
          href="/neu"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span className="text-base leading-none">+</span> Neuer Eintrag
        </Link>
      </div>

      {/* Leer */}
      {eintraege.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 font-medium">Noch keine Einträge</p>
          <Link href="/neu" className="inline-block mt-3 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {alleKapitel.map((kapitel) => {
            const quellen = grouped[kapitel]
            return (
              <div key={kapitel} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {/* Kapitel-Header */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{kapitel}</span>
                  <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                    {quellen.length} Quelle{quellen.length !== 1 ? 'n' : ''}
                  </span>
                </div>
                {/* Quellen */}
                <ul>
                  {quellen.map((e, i) => {
                    const meta = TYP_META[e.typ] ?? TYP_META.sonstige
                    const preview = e.prompt || e.titel || e.url || e.beschreibung || '—'
                    return (
                      <li key={e.id} className={i > 0 ? 'border-t border-slate-100' : ''}>
                        <Link href={`/${e.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-indigo-50 transition-colors group">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 ${TYP_BADGE[e.typ] ?? TYP_BADGE.sonstige}`}>
                            {meta.emoji} {meta.label}
                          </span>
                          <span className="text-sm text-slate-600 truncate group-hover:text-indigo-600 transition-colors">
                            {preview.slice(0, 80)}{preview.length > 80 ? '…' : ''}
                          </span>
                          <span className="text-xs text-slate-300 ml-auto shrink-0">
                            {new Date(e.erstellt_am).toLocaleDateString('de-AT')}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
