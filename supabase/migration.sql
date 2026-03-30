-- Migration: Quellen-Typen hinzufügen
-- In Supabase SQL Editor ausführen

ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS typ text NOT NULL DEFAULT 'ki';
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS titel text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS autor text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS jahr text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS verlag text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS seiten text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS zugriffsdatum text;
ALTER TABLE eintraege ADD COLUMN IF NOT EXISTS beschreibung text;
ALTER TABLE eintraege ALTER COLUMN prompt DROP NOT NULL;
ALTER TABLE eintraege ALTER COLUMN ki_ausgabe DROP NOT NULL;
