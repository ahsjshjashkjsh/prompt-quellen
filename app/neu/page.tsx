'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createEintragAction } from '@/actions/eintraege'
import { KAPITEL } from '@/lib/kapitel'

const TYPEN = [
  { id: 'ki',        label: 'KI-Prompt',  emoji: '🤖', desc: 'ChatGPT, Claude …',    color: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { id: 'literatur', label: 'Literatur',  emoji: '📚', desc: 'Buch, Artikel …',       color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { id: 'website',   label: 'Website',    emoji: '🌐', desc: 'Online-Quelle, URL',    color: 'border-cyan-300 bg-cyan-50 text-cyan-700' },
  { id: 'bild',      label: 'Bild',       emoji: '🖼️', desc: 'Grafik, Abbildung',     color: 'border-violet-300 bg-violet-50 text-violet-700' },
  { id: 'sonstige',  label: 'Sonstige',   emoji: '📄', desc: 'Andere Quellen',        color: 'border-slate-300 bg-slate-50 text-slate-700' },
]

const I = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white placeholder-slate-300 transition'
const TA = I + ' resize-y'

function F({ label, name, req, ph, hint, type = 'text' }: {
  label: string; name: string; req?: boolean; ph?: string; hint?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}{req && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      <input name={name} type={type} required={req} placeholder={ph} className={I} />
    </div>
  )
}

function TA2({ label, name, req, ph, hint, rows = 4 }: {
  label: string; name: string; req?: boolean; ph?: string; hint?: string; rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}{req && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      <textarea name={name} rows={rows} required={req} placeholder={ph} className={TA} />
    </div>
  )
}

export default function NeuPage() {
  const [typ, setTyp] = useState('ki')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-4">
          ← Zurück
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Neue Quelle</h1>
      </div>

      {/* Typ-Auswahl */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Quellentyp</p>
        <div className="grid grid-cols-5 gap-2">
          {TYPEN.map((t) => (
            <button key={t.id} type="button" onClick={() => setTyp(t.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all ${
                typ === t.id ? t.color + ' border-2' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}>
              <span className="text-xl">{t.emoji}</span>
              <span className="text-xs font-bold leading-tight">{t.label}</span>
              <span className="text-xs text-slate-400 leading-tight hidden sm:block">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <form action={createEintragAction} className="p-5 space-y-4">
          <input type="hidden" name="typ" value={typ} />

          {/* Kapitel-Auswahl */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Kapitel <span className="text-indigo-500">*</span>
            </label>
            <select name="abschnitt" required className={I}>
              <option value="">— Kapitel auswählen —</option>
              {KAPITEL.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* KI */}
          {typ === 'ki' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <TA2 label="Eigener Text (Original)" name="eigener_text" ph="Dein ursprünglicher Text vor der KI-Bearbeitung" rows={3} />
              <TA2 label="Prompt" name="prompt" req ph="Was du der KI eingegeben hast" rows={3} />
              <TA2 label="KI-Ausgabe" name="ki_ausgabe" req ph="Was die KI zurückgegeben hat" rows={4} />
            </div>
          )}

          {/* Literatur */}
          {typ === 'literatur' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <F label="Titel" name="titel" req ph="z.B. Der Titel des Buches" />
              <F label="Autor(en)" name="autor" req ph="z.B. Max Mustermann" />
              <div className="grid grid-cols-2 gap-3">
                <F label="Jahr" name="jahr" ph="z.B. 2023" />
                <F label="Seiten" name="seiten" ph="z.B. 45–47" />
              </div>
              <F label="Verlag" name="verlag" ph="z.B. Musterverlag" />
              <TA2 label="Notizen" name="beschreibung" ph="Eigene Anmerkungen zur Quelle" rows={2} />
            </div>
          )}

          {/* Website */}
          {typ === 'website' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <F label="Titel der Seite" name="titel" req ph="z.B. Wikipedia: Klimawandel" />
              <F label="URL" name="url" req ph="https://…" type="url" />
              <F label="Zugriffsdatum" name="zugriffsdatum" req ph="z.B. 30.03.2026" />
              <TA2 label="Notizen" name="beschreibung" ph="Relevante Informationen von der Seite" rows={2} />
            </div>
          )}

          {/* Bild */}
          {typ === 'bild' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <F label="Titel / Beschreibung" name="titel" req ph="z.B. Abbildung 1: Goldpreisdiagramm" />
              <F label="Quelle / URL" name="url" ph="https://…" type="url" />
              <div className="grid grid-cols-2 gap-3">
                <F label="Autor / Urheber" name="autor" ph="z.B. Max Mustermann" />
                <F label="Jahr" name="jahr" ph="z.B. 2023" />
              </div>
              <TA2 label="Beschreibung" name="beschreibung" ph="Wofür wird das Bild verwendet?" rows={2} />
            </div>
          )}

          {/* Sonstige */}
          {typ === 'sonstige' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <F label="Titel" name="titel" req ph="z.B. Experteninterview" />
              <div className="grid grid-cols-2 gap-3">
                <F label="Autor / Herkunft" name="autor" ph="z.B. Dr. Musterfrau" />
                <F label="Jahr" name="jahr" ph="z.B. 2026" />
              </div>
              <TA2 label="Beschreibung" name="beschreibung" req ph="Beschreibe die Quelle" rows={3} />
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button type="submit"
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-colors shadow-sm">
              Speichern
            </button>
            <Link href="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
