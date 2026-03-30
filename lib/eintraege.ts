// lib/eintraege.ts
import { createSupabaseClient } from '@/lib/supabase'

export type Typ = 'ki' | 'literatur' | 'website' | 'bild' | 'sonstige'

export const TYP_META: Record<Typ, { label: string; emoji: string }> = {
  ki:        { label: 'KI-Prompt', emoji: '🤖' },
  literatur: { label: 'Literatur', emoji: '📚' },
  website:   { label: 'Website',   emoji: '🌐' },
  bild:      { label: 'Bild',      emoji: '🖼️' },
  sonstige:  { label: 'Sonstige',  emoji: '📄' },
}

export type Eintrag = {
  id: string
  typ: Typ
  abschnitt: string
  erstellt_am: string
  // KI
  eigener_text: string | null
  prompt: string | null
  ki_ausgabe: string | null
  // Literatur
  autor: string | null
  titel: string | null
  jahr: string | null
  verlag: string | null
  seiten: string | null
  // Website / Bild
  url: string | null
  zugriffsdatum: string | null
  // Sonstige / Bild
  beschreibung: string | null
}

export type EintragInput = Omit<Eintrag, 'id' | 'erstellt_am'>

// Schlanker Typ für die Listenansicht — keine grossen Textfelder
export type EintragKurz = {
  id: string; typ: Typ; abschnitt: string; erstellt_am: string
  titel: string | null; url: string | null; prompt: string | null; beschreibung: string | null
}

export async function listEintraege(typ?: string): Promise<EintragKurz[]> {
  const supabase = createSupabaseClient()
  let query = supabase
    .from('eintraege')
    .select('id,typ,abschnitt,erstellt_am,titel,url,prompt,beschreibung')
    .order('erstellt_am', { ascending: false })
  if (typ && typ !== 'alle') {
    query = query.eq('typ', typ)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as EintragKurz[]
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

export async function createEintrag(input: Partial<EintragInput>): Promise<Eintrag> {
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
