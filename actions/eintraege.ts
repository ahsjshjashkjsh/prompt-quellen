'use server'

import { redirect } from 'next/navigation'
import {
  createEintrag,
  updateEintrag,
  deleteEintrag,
  type EintragInput,
} from '@/lib/eintraege'

export async function createEintragAction(formData: FormData) {
  const input: EintragInput = {
    abschnitt: formData.get('abschnitt') as string,
    eigener_text: (formData.get('eigener_text') as string) || undefined,
    prompt: formData.get('prompt') as string,
    ki_ausgabe: formData.get('ki_ausgabe') as string,
  }
  await createEintrag(input)
  redirect('/')
}

export async function updateEintragAction(id: string, formData: FormData) {
  const input: Partial<EintragInput> = {
    abschnitt: formData.get('abschnitt') as string,
    eigener_text: (formData.get('eigener_text') as string) || undefined,
    prompt: formData.get('prompt') as string,
    ki_ausgabe: formData.get('ki_ausgabe') as string,
  }
  await updateEintrag(id, input)
  redirect(`/${id}`)
}

export async function deleteEintragAction(id: string) {
  await deleteEintrag(id)
  redirect('/')
}
