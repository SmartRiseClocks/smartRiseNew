# SmartRise

SmartRise verbindet einen `Arduino Nano ESP32` mit `Supabase` und einem auf `Vercel` deployten Web-Dashboard.

## Datenfluss

1. Der Arduino sendet per HTTPS an `supabase/functions/v1/arduino-ingest`.
2. Die Edge Function ordnet das Geraet ueber `device_id` und `pairing_code` einem Nutzer zu.
3. Neue Messwerte landen in `public.sensor_readings`.
4. Weckvorgaenge werden in `public.wake_events` fortgeschrieben.
5. Das Dashboard liest die Werte aus Supabase und aktualisiert sich live ueber Realtime.

## Relevante Dashboard-Felder

Das Dashboard zeigt jetzt nur noch:

- verknuepftes Geraet
- aktuelle Weckzeit
- aktuelles Lichtlevel
- letzter abgeschlossener Weckvorgang
- letzte Synchronisation

## Vercel Variablen

Fuer das Frontend in Vercel braucht ihr mindestens:

```env
VITE_SUPABASE_URL=https://yayzxkhdrlidtnafwhrm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_URL=https://yayzxkhdrlidtnafwhrm.supabase.co
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Supabase Function Secrets

In der Edge Function `arduino-ingest` muessen diese Secrets gesetzt sein:

```env
SUPABASE_URL=https://yayzxkhdrlidtnafwhrm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ARDUINO_INGEST_SECRET=...
```

## Arduino Konfiguration

In [SmartRise_Arduino_WLAN_Supabase.txt](/\\lserv1.ba-horb.de\profile$\WIW\w25030\Desktop\smartRise\smartRiseNew-main\SmartRise_Arduino_WLAN_Supabase.txt) diese Werte setzen:

```cpp
const char* WIFI_SSID = "DEIN_WLAN_NAME";
const char* WIFI_PASSWORD = "DEIN_WLAN_PASSWORT";
const char* DEVICE_ID = "SR-NANO-001";
const char* PAIRING_CODE = "123456";
const char* ARDUINO_INGEST_SECRET = "DEIN_INGEST_SECRET";
```

Wichtig:

- `DEVICE_ID` muss pro Geraet dauerhaft gleich bleiben.
- `PAIRING_CODE` wird im Dashboard erzeugt und nur fuer die erste Kopplung gebraucht.
- `ARDUINO_INGEST_SECRET` muss exakt dem Secret der Supabase Function entsprechen.

## Supabase Setup

Vor dem Deploy sicherstellen:

- alle SQL-Migrationen aus `supabase/migrations` sind im produktiven Supabase-Projekt ausgefuehrt
- fuer Realtime sind `sensor_readings`, `wake_events` und `devices` in der Realtime-Publication aktiviert
- die Edge Function `arduino-ingest` ist deployed

## Deploy-Reihenfolge

1. Supabase-Migrationen anwenden.
2. Edge Function `arduino-ingest` deployen und Secrets setzen.
3. Vercel-Umgebungsvariablen setzen.
4. Arduino mit `device_id`, frischem `pairing_code` und `ARDUINO_INGEST_SECRET` flashen.
5. Dashboard in Vercel deployen.
