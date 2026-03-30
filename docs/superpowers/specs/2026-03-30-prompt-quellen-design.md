# Design: Prompt-Quellen Tracker

**Datum:** 2026-03-30
**Zweck:** Abschlussarbeit — KI-Prompt-Quellen dokumentieren (eigener Text, Prompt, KI-Ausgabe)
**Stack:** Next.js (App Router) + Supabase + Vercel

---

## Kontext

Schüler müssen bei ihrer Abschlussarbeit dokumentieren, wo sie KI zur Korrektur verwendet haben. Die Lehrerin verlangt einen Quellennachweis mit Prompt und KI-Ausgabe, wenn der KI-generierte Text übernommen wurde. Diese App ermöglicht es einer 2-Personen-Gruppe, solche Einträge zentral zu verwalten.

---

## Architektur

```
Vercel (Next.js App Router)
├── Middleware        → Passwortschutz via Cookie
├── /login            → Passwort eingeben
├── /                 → Übersicht aller Einträge
├── /neu              → Neuen Eintrag erstellen
└── /[id]             → Eintrag anzeigen, bearbeiten, löschen

Supabase (PostgreSQL)
└── API Routes (Next.js Server Actions / Route Handlers)
    └── Direkte Supabase-Anbindung via Service Role Key
```

---

## Datenbank

**Tabelle: `eintraege`**

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid (PK, default gen_random_uuid()) | Eindeutige ID |
| `abschnitt` | text, NOT NULL | Titel/Abschnitt der Arbeit, z.B. "Kapitel 2 - Methoden" |
| `eigener_text` | text | Der ursprüngliche eigene Text des Schülers |
| `prompt` | text, NOT NULL | Der an die KI gesendete Prompt |
| `ki_ausgabe` | text, NOT NULL | Die Ausgabe der KI |
| `erstellt_am` | timestamptz, default now() | Erstellungszeitpunkt |

---

## Seiten

### `/login`
- Einzelnes Passwortfeld
- Passwort wird gegen `SITE_PASSWORD` Env Variable geprüft
- Bei Erfolg: HttpOnly Cookie `auth` gesetzt (Wert = Passwort-Hash), Redirect zu `/`
- Bei Fehler: Fehlermeldung "Falsches Passwort"

### `/` — Übersicht
- Liste aller Einträge, sortiert nach `erstellt_am DESC`
- Pro Eintrag: Abschnitt, Datum, erste ~80 Zeichen des Prompts
- Button "Neuer Eintrag" oben rechts
- Klick auf Eintrag → `/[id]`

### `/neu` — Neuer Eintrag
- Formular: Abschnitt (text input), Eigener Text (textarea), Prompt (textarea), KI-Ausgabe (textarea)
- "Speichern" → POST zu Supabase → Redirect zu `/`
- "Abbrechen" → zurück zu `/`

### `/[id]` — Detail / Bearbeiten / Löschen
- Zeigt alle 4 Felder vollständig
- "Bearbeiten": wandelt Felder in editierbare Inputs um (inline edit)
- "Löschen": Bestätigungsdialog → löscht Eintrag → Redirect zu `/`

---

## Authentifizierung

- Kein User-Account-System
- Ein gemeinsames Passwort, gespeichert als Vercel Env Variable `SITE_PASSWORD`
- Next.js Middleware prüft bei jedem Request das Cookie
- Kein Zugriff auf `/`, `/neu`, `/[id]` ohne gültiges Cookie
- Logout-Button in der Navigation setzt Cookie auf leer

---

## Styling

- Tailwind CSS
- Schlicht, funktional, kein aufwändiges Design
- Responsive (funktioniert auch am Handy)

---

## Deployment

1. Supabase Projekt erstellen, Tabelle anlegen
2. GitHub Repo erstellen, Code pushen
3. Vercel mit GitHub verbinden
4. Env Variables in Vercel setzen: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_PASSWORD`
5. Deploy

---

## Was diese App NICHT macht

- Keine KI-Integration
- Keine Benutzerkonten / Rollen
- Kein Export (PDF, CSV) — nicht benötigt
- Keine Volltextsuche — bei max. 200 Einträgen unnötig
