'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createEintragAction } from '@/actions/eintraege'
import { KAPITEL } from '@/lib/kapitel'

const TYPEN = [
  { id: 'ki',        label: 'KI-Prompt',  emoji: '🤖', desc: 'ChatGPT, Claude, etc.' },
  { id: 'literatur', label: 'Literatur',  emoji: '📚', desc: 'Buch, Artikel, Fachtext' },
  { id: 'website',   label: 'Website',    emoji: '🌐', desc: 'Online-Quelle, URL' },
  { id: 'bild',      label: 'Bild',       emoji: '🖼️', desc: 'Abbildung, Grafik, Foto' },
  { id: 'sonstige',  label: 'Sonstige',   emoji: '📄', desc: 'Andere Quellen' },
]

const INPUT = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 placeholder-slate-300 transition'
const TEXTAREA = INPUT + ' resize-y'

function Field({ label, name, required, placeholder, hint, type = 'text' }: {
  label: string; name: string; required?: boolean; placeholder?: string; hint?: string; type?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-indigo-500">*</span>}
        {!required && <span className="font-normal text-slate-400"> (optional)</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className={INPUT} />
    </div>
  )
}

function TextArea({ label, name, required, placeholder, hint }: {
  label: string; name: string; required?: boolean; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-indigo-500">*</span>}
        {!required && <span className="font-normal text-slate-400"> (optional)</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      <textarea id={name} name={name} rows={4} required={required} placeholder={placeholder} className={TEXTAREA} />
    </div>
  )
}

export default function NeuPage() {
  const [typ, setTyp] = useState('ki')

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 mb-4">← Zurück</Link>
        <h1 className="text-2xl font-bold text-slate-900">Neue Quelle</h1>
        <p className="text-sm text-slate-500 mt-1">Wähle den Quellen-Typ und fülle die Felder aus</p>
      </div>

      {/* Typ-Auswahl */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {TYPEN.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTyp(t.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center transition-all ${
              typ === t.id
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className="text-xs font-semibold">{t.label}</span>
            <span className="text-xs text-slate-400 leading-tight">{t.desc}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <form action={createEintragAction} className="space-y-5">
          <input type="hidden" name="typ" value={typ} />

          {/* Gemeinsames Feld */}
          <div>
            <label htmlFor="abschnitt" className="block text-sm font-semibold text-slate-700 mb-1">
              Kapitel / Abschnitt <span className="text-indigo-500">*</span>
            </label>
            <select id="abschnitt" name="abschnitt" required className={INPUT}>
              <option value="">— Kapitel auswählen —</option>
              {KAPITEL.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* KI */}
          {typ === 'ki' && <>
            <TextArea label="Eigener Text (Original)" name="eigener_text" placeholder="Dein ursprünglicher Text vor der KI-Korrektur" hint="Der Text den du der KI gegeben hast" />
            <TextArea label="Prompt" name="prompt" required placeholder="Was du der KI eingegeben hast" hint="Genauer Wortlaut des Prompts" />
            <TextArea label="KI-Ausgabe" name="ki_ausgabe" required placeholder="Was die KI zurückgegeben hat" hint="Vollständige Antwort der KI" />
          </>}

          {/* Literatur */}
          {typ === 'literatur' && <>
            <Field label="Titel des Werks" name="titel" required placeholder="z.B. Der Titel des Buches" />
            <Field label="Autor(en)" name="autor" required placeholder="z.B. Max Mustermann" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Jahr" name="jahr" placeholder="z.B. 2023" />
              <Field label="Seiten" name="seiten" placeholder="z.B. 45–47" />
            </div>
            <Field label="Verlag" name="verlag" placeholder="z.B. Musterverlag" />
            <TextArea label="Notizen" name="beschreibung" placeholder="Eigene Anmerkungen zur Quelle" />
          </>}

          {/* Website */}
          {typ === 'website' && <>
            <Field label="Titel der Seite" name="titel" required placeholder="z.B. Wikipedia: Klimawandel" />
            <Field label="URL" name="url" required placeholder="https://..." type="url" />
            <Field label="Zugriffsdatum" name="zugriffsdatum" required placeholder="z.B. 30.03.2026" />
            <TextArea label="Notizen" name="beschreibung" placeholder="Relevante Informationen von der Seite" />
          </>}

          {/* Bild */}
          {typ === 'bild' && <>
            <Field label="Titel / Beschreibung" name="titel" required placeholder="z.B. Abbildung 1: Klimadiagramm" />
            <Field label="Quelle / URL" name="url" placeholder="https://..." type="url" />
            <Field label="Autor / Urheber" name="autor" placeholder="z.B. Max Mustermann" />
            <Field label="Jahr" name="jahr" placeholder="z.B. 2023" />
            <TextArea label="Beschreibung" name="beschreibung" placeholder="Wofür wird das Bild verwendet?" />
          </>}

          {/* Sonstige */}
          {typ === 'sonstige' && <>
            <Field label="Titel" name="titel" required placeholder="z.B. Experteninterview" />
            <Field label="Autor / Herkunft" name="autor" placeholder="z.B. Dr. Musterfrau" />
            <Field label="Jahr" name="jahr" placeholder="z.B. 2026" />
            <TextArea label="Beschreibung" name="beschreibung" required placeholder="Beschreibe die Quelle" />
          </>}

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-colors shadow-sm">
              Speichern
            </button>
            <Link href="/" className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
