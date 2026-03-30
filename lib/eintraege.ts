// lib/eintraege.ts
import { createSupabaseClient } from '@/lib/supabase'

export type Eintrag = {
  id: string
  abschnitt: string
  eigener_text: string | null
  prompt: string
  ki_ausgabe: string
  erstellt_am: string
}

export type EintragInput = {
  abschnitt: string
  eigener_text?: string
  prompt: string
  ki_ausgabe: string
}

export async function listEintraege(): Promise<Eintrag[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .select('*')
    .order('erstellt_am', { ascending: false })
  if (error) throw new Error(error.message)
  return data as Eintrag[]
}

export async function getEintrag(id: string): Promise<Eintrag> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data as Eintrag
}

export async function createEintrag(input: EintragInput): Promise<Eintrag> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .insert([input])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Eintrag
}

export async function updateEintrag(id: string, input: Partial<EintragInput>): Promise<Eintrag> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('eintraege')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Eintrag
}

export async function deleteEintrag(id: string): Promise<void> {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from('eintraege').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
