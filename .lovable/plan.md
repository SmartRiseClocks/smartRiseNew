## Ziel
Bestehende SmartRise-Landingpage **unverändert** lassen und ergänzen um: Login/Register, geschütztes Dashboard, Arduino-Geräteverknüpfung, Aufsteh-Statistiken und Feedback-Formular.

## Backend (Lovable Cloud aktivieren)
Lovable Cloud wird aktiviert (Auth + Postgres). Folgende Tabellen werden angelegt, jeweils mit RLS so dass Nutzer nur eigene Daten sehen:

- `profiles` (id = auth.users.id, display_name, created_at) — auto via Trigger bei Signup
- `devices` (id, user_id, device_id [unique pro user], name, linked_at)
- `wake_events` (id, user_id, device_id, alarm_start, light_on, created_at) — speichert pro Aufstehen Weckerstart + Lichtzeitpunkt; daraus werden wöchentliche Aufstehzeiten und Ø-Differenz berechnet
- `feedback` (id, user_id, message, created_at)

RLS-Policies: `user_id = auth.uid()` für SELECT/INSERT/UPDATE/DELETE auf eigene Zeilen. Profiles analog über `id = auth.uid()`.

Architektur ist API-ready: später kann der Arduino per HTTP-Endpoint (`/api/public/ingest` mit Device-ID + Secret) `wake_events` schreiben — Frontend liest weiterhin nur aus Supabase.

## Neue Routen / Dateien (nichts Bestehendes wird verändert)

```
src/routes/
  login.tsx            → Login + Register (Email/Passwort, autoConfirm)
  _authenticated.tsx   → Schutzschicht (redirect → /login wenn nicht eingeloggt)
  _authenticated/
    dashboard.tsx      → Dashboard-Seite
src/components/dashboard/
  DeviceLink.tsx       → Arduino-ID koppeln + Liste verknüpfter Geräte
  WakeChart.tsx        → Recharts-Balkendiagramm wöchentliche Aufstehzeiten
  AvgDelayCard.tsx     → Ø Zeit Weckerbeginn → Licht an
  FeedbackForm.tsx     → Feedback eingeben + senden
src/hooks/
  use-auth.ts          → Session-State + signIn/signUp/signOut
```

In `src/components/SmartRiseLanding.tsx` wird **nur** im Header ein zusätzlicher Button „Anmelden" (bzw. „Dashboard" wenn eingeloggt) **neben** dem bestehenden „Preorder anfragen"-Button eingefügt. Keine anderen Änderungen.

## Dashboard-Inhalte
1. **DeviceLink** — Eingabefeld für Arduino-Geräte-ID + „Verknüpfen". Zeigt Liste aller mit dem Konto verknüpften Geräte; Entkoppeln möglich.
2. **WakeChart** — Balkendiagramm (Recharts) Mo–So mit Aufstehzeit (h:mm) der letzten Woche. Solange noch keine echten `wake_events` existieren: Dummy-Daten (deutlich als „Beispieldaten" gekennzeichnet).
3. **AvgDelayCard** — Großzahl-Karte mit Ø Minuten/Sekunden zwischen `alarm_start` und `light_on` über die letzten 7 Tage. Bei leerer Tabelle: Dummy-Wert + Hinweis.
4. **FeedbackForm** — Textarea + „Senden", schreibt in `feedback`-Tabelle, Toast-Bestätigung.

## Auth-Flow
- `/login` zeigt Tabs Login / Registrieren (Email + Passwort, min. 8 Zeichen, zod-validiert).
- Nach Erfolg → Redirect auf `/dashboard`.
- Header-Button auf der Landingpage:
  - nicht eingeloggt → „Anmelden" → `/login`
  - eingeloggt → „Dashboard" → `/dashboard` + kleiner Logout-Link
- `_authenticated`-Layout schützt `/dashboard` via `beforeLoad` (redirect → `/login` wenn keine Session).

## Was unverändert bleibt
Sämtliche bestehenden Sektionen, Texte, Styles, Buttons (Preorder, Zum Produkt, Wissenschaft, Team etc.), Tokens in `styles.css`, vorhandene Komponenten — keine Umgestaltung.

## Offene Punkte (kurz bestätigen)
1. **Email-Bestätigung** beim Registrieren: aus Gründen schneller UX deaktivieren (Auto-Confirm), oder klassischer Bestätigungslink? Default-Vorschlag: **Auto-Confirm an**, damit Test sofort möglich.
2. **Arduino-Anbindung jetzt schon real?** Vorschlag: Schema + Tabelle anlegen, aber `/api/public/ingest` jetzt **nicht** mitbauen — nur vorbereiten; Dashboard nutzt Dummy-Daten bis echte Events kommen. Soll ich den Ingest-Endpoint trotzdem direkt mitbauen?