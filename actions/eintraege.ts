'use server'

import { redirect } from 'next/navigation'
import { createEintrag, updateEintrag, deleteEintrag, type Typ } from '@/lib/eintraege'

function str(v: FormDataEntryValue | null): string | undefined {
  const s = v as string
  return s && s.trim() !== '' ? s.trim() : undefined
}

export async function createEintragAction(formData: FormData) {
  const typ = (formData.get('typ') as Typ) || 'ki'
  await createEintrag({
    typ,
    abschnitt: formData.get('abschnitt') as string,
    // KI
    eigener_text: str(formData.get('eigener_text')),
    prompt: str(formData.get('prompt')),
    ki_ausgabe: str(formData.get('ki_ausgabe')),
    // Literatur
    autor: str(formData.get('autor')),
    titel: str(formData.get('titel')),
    jahr: str(formData.get('jahr')),
    verlag: str(formData.get('verlag')),
    seiten: str(formData.get('seiten')),
    // Website / Bild
    url: str(formData.get('url')),
    zugriffsdatum: str(formData.get('zugriffsdatum')),
    // Sonstige
    beschreibung: str(formData.get('beschreibung')),
  })
  redirect('/')
}

export async function updateEintragAction(id: string, formData: FormData) {
  const typ = (formData.get('typ') as Typ) || 'ki'
  await updateEintrag(id, {
    typ,
    abschnitt: formData.get('abschnitt') as string,
    eigener_text: str(formData.get('eigener_text')),
    prompt: str(formData.get('prompt')),
    ki_ausgabe: str(formData.get('ki_ausgabe')),
    autor: str(formData.get('autor')),
    titel: str(formData.get('titel')),
    jahr: str(formData.get('jahr')),
    verlag: str(formData.get('verlag')),
    seiten: str(formData.get('seiten')),
    url: str(formData.get('url')),
    zugriffsdatum: str(formData.get('zugriffsdatum')),
    beschreibung: str(formData.get('beschreibung')),
  })
  redirect(`/${id}`)
}

export async function deleteEintragAction(id: string) {
  await deleteEintrag(id)
  redirect('/')
}
