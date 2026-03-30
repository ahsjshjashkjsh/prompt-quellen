// app/neu/page.tsx
import Link from 'next/link'
import { createEintragAction } from '@/actions/eintraege'

export default function NeuPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Neuer Eintrag</h1>
      <form action={createEintragAction} className="space-y-5">
        <div>
          <label htmlFor="abschnitt" className="block text-sm font-medium mb-1">
            Abschnitt / Titel <span className="text-red-500">*</span>
          </label>
          <input
            id="abschnitt"
            name="abschnitt"
            type="text"
            required
            placeholder="z.B. Kapitel 2 – Methoden"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="eigener_text" className="block text-sm font-medium mb-1">
            Eigener Text (Original)
          </label>
          <textarea
            id="eigener_text"
            name="eigener_text"
            rows={4}
            placeholder="Dein ursprünglicher Text vor der KI-Korrektur"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Prompt (an die KI) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            required
            placeholder="Was du der KI eingegeben hast"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="ki_ausgabe" className="block text-sm font-medium mb-1">
            KI-Ausgabe <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ki_ausgabe"
            name="ki_ausgabe"
            rows={4}
            required
            placeholder="Was die KI zurückgegeben hat"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
          >
            Speichern
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
