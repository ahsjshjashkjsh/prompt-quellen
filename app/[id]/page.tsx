// app/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEintrag, TYP_META } from '@/lib/eintraege'
import { updateEintragAction, deleteEintragAction } from '@/actions/eintraege'

function Section({ label, value, bg }: { label: string; value: string | null; bg: string }) {
  if (!value) return null
  return (
    <div className={`${bg} rounded-2xl p-5`}>
      <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">{label}</h2>
      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700 break-all">{value}</span>
    </div>
  )
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let eintrag
  try {
    eintrag = await getEintrag(id)
  } catch {
    notFound()
  }

  const meta = TYP_META[eintrag.typ] ?? TYP_META.sonstige
  const updateAction = updateEintragAction.bind(null, eintrag.id)
  const deleteAction = deleteEintragAction.bind(null, eintrag.id)

  const TYP_BADGE: Record<string, string> = {
    ki:        'bg-indigo-100 text-indigo-700',
    literatur: 'bg-blue-100 text-blue-700',
    website:   'bg-cyan-100 text-cyan-700',
    bild:      'bg-purple-100 text-purple-700',
    sonstige:  'bg-slate-100 text-slate-600',
  }

  return (
    <div>
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 mb-6">
        ← Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${TYP_BADGE[eintrag.typ] ?? TYP_BADGE.sonstige}`}>
              {meta.emoji} {meta.label}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{eintrag.abschnitt}</h1>
          </div>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl shrink-0">
            {new Date(eintrag.erstellt_am).toLocaleString('de-AT')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* KI */}
        {eintrag.typ === 'ki' && <>
          <Section label="✏️ Eigener Text" value={eintrag.eigener_text} bg="bg-blue-50 border border-blue-100" />
          <Section label="💬 Prompt" value={eintrag.prompt} bg="bg-amber-50 border border-amber-100" />
          <Section label="🤖 KI-Ausgabe" value={eintrag.ki_ausgabe} bg="bg-emerald-50 border border-emerald-100" />
        </>}

        {/* Literatur */}
        {eintrag.typ === 'literatur' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">📚 Literaturangaben</h2>
            <Row label="Titel" value={eintrag.titel} />
            <Row label="Autor(en)" value={eintrag.autor} />
            <Row label="Jahr" value={eintrag.jahr} />
            <Row label="Verlag" value={eintrag.verlag} />
            <Row label="Seiten" value={eintrag.seiten} />
            {eintrag.beschreibung && <Row label="Notizen" value={eintrag.beschreibung} />}
          </div>
        )}

        {/* Website */}
        {eintrag.typ === 'website' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">🌐 Website-Angaben</h2>
            <Row label="Titel" value={eintrag.titel} />
            <Row label="URL" value={eintrag.url} />
            <Row label="Zugriff" value={eintrag.zugriffsdatum} />
            {eintrag.beschreibung && <Section label="Notizen" value={eintrag.beschreibung} bg="bg-slate-50 border border-slate-100" />}
          </div>
        )}

        {/* Bild */}
        {eintrag.typ === 'bild' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">🖼️ Bildangaben</h2>
            <Row label="Titel" value={eintrag.titel} />
            <Row label="Autor" value={eintrag.autor} />
            <Row label="Jahr" value={eintrag.jahr} />
            <Row label="URL" value={eintrag.url} />
            {eintrag.beschreibung && <Row label="Beschreibung" value={eintrag.beschreibung} />}
          </div>
        )}

        {/* Sonstige */}
        {eintrag.typ === 'sonstige' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">📄 Angaben</h2>
            <Row label="Titel" value={eintrag.titel} />
            <Row label="Autor" value={eintrag.autor} />
            <Row label="Jahr" value={eintrag.jahr} />
            {eintrag.beschreibung && <Section label="Beschreibung" value={eintrag.beschreibung} bg="bg-slate-50 border border-slate-100 mt-3" />}
          </div>
        )}

        {/* Edit */}
        <details className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors select-none">
            ✏️ Eintrag bearbeiten
          </summary>
          <div className="px-5 pb-5 pt-2 border-t border-slate-100">
            <form action={updateAction} className="space-y-4 mt-2">
              <input type="hidden" name="typ" value={eintrag.typ} />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Abschnitt</label>
                <input name="abschnitt" type="text" required defaultValue={eintrag.abschnitt}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              </div>
              {eintrag.typ === 'ki' && <>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Eigener Text</label>
                  <textarea name="eigener_text" rows={3} defaultValue={eintrag.eigener_text ?? ''}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-y" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Prompt</label>
                  <textarea name="prompt" rows={3} required defaultValue={eintrag.prompt ?? ''}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-y" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">KI-Ausgabe</label>
                  <textarea name="ki_ausgabe" rows={3} required defaultValue={eintrag.ki_ausgabe ?? ''}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-y" /></div>
              </>}
              {eintrag.typ === 'literatur' && <>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Titel</label>
                  <input name="titel" type="text" defaultValue={eintrag.titel ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Autor</label>
                  <input name="autor" type="text" defaultValue={eintrag.autor ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1">Jahr</label>
                    <input name="jahr" type="text" defaultValue={eintrag.jahr ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1">Seiten</label>
                    <input name="seiten" type="text" defaultValue={eintrag.seiten ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Verlag</label>
                  <input name="verlag" type="text" defaultValue={eintrag.verlag ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
              </>}
              {(eintrag.typ === 'website' || eintrag.typ === 'bild') && <>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Titel</label>
                  <input name="titel" type="text" defaultValue={eintrag.titel ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">URL</label>
                  <input name="url" type="text" defaultValue={eintrag.url ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                {eintrag.typ === 'website' && <div><label className="block text-sm font-semibold text-slate-700 mb-1">Zugriffsdatum</label>
                  <input name="zugriffsdatum" type="text" defaultValue={eintrag.zugriffsdatum ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>}
              </>}
              {eintrag.typ === 'sonstige' && <>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Titel</label>
                  <input name="titel" type="text" defaultValue={eintrag.titel ?? ''} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Beschreibung</label>
                  <textarea name="beschreibung" rows={3} defaultValue={eintrag.beschreibung ?? ''}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-y" /></div>
              </>}
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-colors shadow-sm">
                Änderungen speichern
              </button>
            </form>
          </div>
        </details>

        {/* Delete */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Eintrag löschen</p>
            <p className="text-xs text-slate-400 mt-0.5">Kann nicht rückgängig gemacht werden</p>
          </div>
          <form action={deleteAction}>
            <button type="submit" className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 font-medium transition-colors">
              Löschen
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
