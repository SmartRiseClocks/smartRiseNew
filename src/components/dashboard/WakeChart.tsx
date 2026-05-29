import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Json } from "@/integrations/supabase/types";

type LatestSensorReading = {
  light_lux: number | null;
  payload: Json;
  recorded_at: string;
};

type WakeEventRow = {
  alarm_start: string;
  light_on: string | null;
};

type WakeSummary = {
  currentLightLux: number | null;
  lastUpdatedAt: string | null;
  wakeDurationMs: number | null;
  wakeStartedAt: string | null;
  wakeTimeLabel: string | null;
};

function isObject(value: Json): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getPayloadNumber(payload: Json, key: string) {
  if (!isObject(payload)) return null;
  const value = payload[key];
  return typeof value === "number" ? value : null;
}

function formatWakeTime(hour: number | null, minute: number | null) {
  if (hour == null || minute == null) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} Uhr`;
}

function formatDuration(ms: number | null) {
  if (ms == null) return "Noch kein abgeschlossener Weckvorgang";
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} Min ${String(seconds).padStart(2, "0")} Sek`;
}

function buildWakeSummary(
  latestReading: LatestSensorReading | null,
  latestWakeEvent: WakeEventRow | null,
): WakeSummary {
  const wakeHour = latestReading ? getPayloadNumber(latestReading.payload, "alarm_hour") : null;
  const wakeMinute = latestReading ? getPayloadNumber(latestReading.payload, "alarm_minute") : null;

  let wakeDurationMs: number | null = null;
  if (latestWakeEvent?.light_on) {
    wakeDurationMs =
      new Date(latestWakeEvent.light_on).getTime() - new Date(latestWakeEvent.alarm_start).getTime();
  }

  return {
    currentLightLux: latestReading?.light_lux ?? null,
    lastUpdatedAt: latestReading?.recorded_at ?? null,
    wakeDurationMs,
    wakeStartedAt: latestWakeEvent?.alarm_start ?? null,
    wakeTimeLabel: formatWakeTime(wakeHour, wakeMinute),
  };
}

export function WakeChart() {
  const [summary, setSummary] = useState<WakeSummary | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      const [{ data: latestReading, error: latestReadingError }, { data: latestWakeEvent, error: latestWakeEventError }] =
        await Promise.all([
          supabase
            .from("sensor_readings")
            .select("light_lux, payload, recorded_at")
            .order("recorded_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("wake_events")
            .select("alarm_start, light_on")
            .not("light_on", "is", null)
            .order("alarm_start", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

      if (!active || latestReadingError || latestWakeEventError) return;
      setSummary(buildWakeSummary(latestReading ?? null, latestWakeEvent ?? null));
    }

    loadSummary();
    const timer = window.setInterval(loadSummary, 10_000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arduino Live-Dashboard</CardTitle>
        <CardDescription>
          Hier stehen genau die drei Werte aus deinem Arduino: Weckzeit, Lichtlevel und Dauer bis Licht den Wecker stoppt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">1. Aktuell eingestellte Weckzeit</p>
              <p className="mt-2 text-2xl font-semibold">{summary.wakeTimeLabel ?? "--:-- Uhr"}</p>
              <p className="mt-2 text-sm text-muted-foreground">Direkt aus dem letzten Arduino-Upload.</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">2. Aktuelles Lichtlevel</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.currentLightLux != null ? `${summary.currentLightLux} lux` : "-"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {summary.lastUpdatedAt
                  ? `Letztes Update: ${new Date(summary.lastUpdatedAt).toLocaleString("de-DE")}`
                  : "Noch keine Sensordaten vorhanden."}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">3. Dauer bis Licht den Wecker stoppt</p>
              <p className="mt-2 text-2xl font-semibold">{formatDuration(summary.wakeDurationMs)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {summary.wakeStartedAt
                  ? `Letzter Weckerstart: ${new Date(summary.wakeStartedAt).toLocaleString("de-DE")}`
                  : "Noch kein abgeschlossener Weckvorgang gespeichert."}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Noch keine persoenlichen Sensordaten vorhanden. Sobald dein Arduino Daten sendet, erscheinen hier die drei
            Arduino-Werte fuer Weckzeit, Lichtlevel und Weckdauer.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
