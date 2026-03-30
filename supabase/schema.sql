-- supabase/schema.sql
create table eintraege (
  id uuid primary key default gen_random_uuid(),
  abschnitt text not null,
  eigener_text text,
  prompt text not null,
  ki_ausgabe text not null,
  erstellt_am timestamptz not null default now()
);
