// app/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEintrag } from '@/lib/eintraege'
import { updateEintragAction, deleteEintragAction } from '@/actions/eintraege'

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let eintrag
  try {
    eintrag = await getEintrag(id)
  } catch {
    notFound()
  }

  const updateAction = updateEintragAction.bind(null, eintrag.id)
  const deleteAction = deleteEintragAction.bind(null, eintrag.id)

  return (
    <div>
      {/* Back */}
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 mb-6">
        ← Zurück zur Übersicht
      </Link>

      {/* Title card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Abschnitt</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{eintrag.abschnitt}</h1>
          </div>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl shrink-0">
            {new Date(eintrag.erstellt_am).toLocaleString('de-AT')}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Eigener Text */}
        {eintrag.eigener_text && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
              <span>✏️</span> Eigener Text
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {eintrag.eigener_text}
            </p>
          </div>
        )}

        {/* Prompt */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
            <span>💬</span> Prompt
          </h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {eintrag.prompt}
          </p>
        </div>

        {/* KI-Ausgabe */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-1.5">
            <span>🤖</span> KI-Ausgabe
          </h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {eintrag.ki_ausgabe}
          </p>
        </div>

        {/* Edit */}
        <details className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors select-none flex items-center gap-2">
            <span>✏️</span> Eintrag bearbeiten
          </summary>
          <div className="px-5 pb-5 pt-2 border-t border-slate-100">
            <form action={updateAction} className="space-y-4 mt-2">
              <div>
                <label htmlFor="abschnitt" className="block text-sm font-semibold text-slate-700 mb-2">Abschnitt</label>
                <input
                  id="abschnitt"
                  name="abschnitt"
                  type="text"
                  required
                  defaultValue={eintrag.abschnitt}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 transition"
                />
              </div>
              <div>
                <label htmlFor="eigener_text" className="block text-sm font-semibold text-slate-700 mb-2">Eigener Text</label>
                <textarea
                  id="eigener_text"
                  name="eigener_text"
                  rows={3}
                  defaultValue={eintrag.eigener_text ?? ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 resize-y transition"
                />
              </div>
              <div>
                <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700 mb-2">Prompt</label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={3}
                  required
                  defaultValue={eintrag.prompt}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 resize-y transition"
                />
              </div>
              <div>
                <label htmlFor="ki_ausgabe" className="block text-sm font-semibold text-slate-700 mb-2">KI-Ausgabe</label>
                <textarea
                  id="ki_ausgabe"
                  name="ki_ausgabe"
                  rows={3}
                  required
                  defaultValue={eintrag.ki_ausgabe}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 resize-y transition"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-colors shadow-sm"
              >
                Änderungen speichern
              </button>
            </form>
          </div>
        </details>

        {/* Delete */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Eintrag löschen</p>
            <p className="text-xs text-slate-400 mt-0.5">Diese Aktion kann nicht rückgängig gemacht werden</p>
          </div>
          <form action={deleteAction}>
            <button
              type="submit"
              className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 font-medium transition-colors"
            >
              Löschen
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
