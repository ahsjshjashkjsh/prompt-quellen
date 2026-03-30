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
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Zurück zur Übersicht
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{eintrag.abschnitt}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(eintrag.erstellt_am).toLocaleString('de-AT')}
            </p>
          </div>
        </div>

        {eintrag.eigener_text && (
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">Eigener Text</h2>
            <p className="bg-white border border-gray-200 rounded p-4 whitespace-pre-wrap text-sm">
              {eintrag.eigener_text}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">Prompt</h2>
          <p className="bg-white border border-gray-200 rounded p-4 whitespace-pre-wrap text-sm">
            {eintrag.prompt}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">KI-Ausgabe</h2>
          <p className="bg-white border border-gray-200 rounded p-4 whitespace-pre-wrap text-sm">
            {eintrag.ki_ausgabe}
          </p>
        </section>

        {/* Edit form */}
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 select-none">
            Eintrag bearbeiten
          </summary>
          <form action={updateAction} className="space-y-4 mt-4">
            <div>
              <label htmlFor="abschnitt" className="block text-sm font-medium mb-1">Abschnitt</label>
              <input
                id="abschnitt"
                name="abschnitt"
                type="text"
                required
                defaultValue={eintrag.abschnitt}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="eigener_text" className="block text-sm font-medium mb-1">Eigener Text</label>
              <textarea
                id="eigener_text"
                name="eigener_text"
                rows={4}
                defaultValue={eintrag.eigener_text ?? ''}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">Prompt</label>
              <textarea
                id="prompt"
                name="prompt"
                rows={4}
                required
                defaultValue={eintrag.prompt}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
            <div>
              <label htmlFor="ki_ausgabe" className="block text-sm font-medium mb-1">KI-Ausgabe</label>
              <textarea
                id="ki_ausgabe"
                name="ki_ausgabe"
                rows={4}
                required
                defaultValue={eintrag.ki_ausgabe}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium text-sm"
            >
              Änderungen speichern
            </button>
          </form>
        </details>

        {/* Delete */}
        <form action={deleteAction} className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="text-sm text-red-500 hover:text-red-700"
          >
            Eintrag löschen
          </button>
        </form>
      </div>
    </div>
  )
}
