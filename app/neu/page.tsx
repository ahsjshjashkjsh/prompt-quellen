// app/neu/page.tsx
import Link from 'next/link'
import { createEintragAction } from '@/actions/eintraege'

export default function NeuPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 mb-4">
          ← Zurück
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Neuer Eintrag</h1>
        <p className="text-sm text-slate-500 mt-1">Dokumentiere einen KI-Quellennachweis</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <form action={createEintragAction} className="space-y-6">

          {/* Abschnitt */}
          <div>
            <label htmlFor="abschnitt" className="block text-sm font-semibold text-slate-700 mb-2">
              Abschnitt / Titel <span className="text-indigo-500">*</span>
            </label>
            <input
              id="abschnitt"
              name="abschnitt"
              type="text"
              required
              placeholder="z.B. Kapitel 2 – Methoden"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 placeholder-slate-300 transition"
            />
          </div>

          {/* Eigener Text */}
          <div>
            <label htmlFor="eigener_text" className="block text-sm font-semibold text-slate-700 mb-2">
              Eigener Text{' '}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">Dein ursprünglicher Text vor der KI-Korrektur</p>
            <textarea
              id="eigener_text"
              name="eigener_text"
              rows={4}
              placeholder="Hier den eigenen Text einfügen…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 placeholder-slate-300 resize-y transition"
            />
          </div>

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700 mb-2">
              Prompt <span className="text-indigo-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">Was du der KI eingegeben hast</p>
            <textarea
              id="prompt"
              name="prompt"
              rows={4}
              required
              placeholder="Hier den Prompt einfügen…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 placeholder-slate-300 resize-y transition"
            />
          </div>

          {/* KI-Ausgabe */}
          <div>
            <label htmlFor="ki_ausgabe" className="block text-sm font-semibold text-slate-700 mb-2">
              KI-Ausgabe <span className="text-indigo-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">Was die KI zurückgegeben hat</p>
            <textarea
              id="ki_ausgabe"
              name="ki_ausgabe"
              rows={4}
              required
              placeholder="Hier die KI-Antwort einfügen…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 placeholder-slate-300 resize-y transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-colors shadow-sm"
            >
              Speichern
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
