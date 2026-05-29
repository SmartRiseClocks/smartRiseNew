import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
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

type DeviceRow = {
  device_id: string;
  linked_at: string;
  name: string | null;
};

type WakeSummary = {
  currentDeviceLabel: string | null;
  currentLightLux: number | null;
  deviceOnline: boolean;
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

function formatLastSeen(timestamp: string | null) {
  if (!timestamp) return "Noch keine Sensordaten";
  return new Date(timestamp).toLocaleString("de-DE");
}

function formatDuration(ms: number | null) {
  if (ms == null) return "Noch kein abgeschlossener Weckvorgang";
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} Min ${String(seconds).padStart(2, "0")} Sek`;
}

function getLightStatus(lightLux: number | null) {
  if (lightLux == null) return "Warte auf den ersten Messwert";
  if (lightLux <= 420) return "Dunkel genug zum Klingeln";
  if (lightLux <= 1500) return "Raum wird heller";
  return "Raum ist hell";
}

function buildWakeSummary(
  latestDevice: DeviceRow | null,
  latestReading: LatestSensorReading | null,
  latestWakeEvent: WakeEventRow | null,
): WakeSummary {
  const wakeHour = latestReading ? getPayloadNumber(latestReading.payload, "alarm_hour") : null;
  const wakeMinute = latestReading ? getPayloadNumber(latestReading.payload, "alarm_minute") : null;

  let wakeDurationMs: number | null = null;
  if (latestWakeEvent?.light_on) {
    wakeDurationMs =
      new Date(latestWakeEvent.light_on).getTime() -
      new Date(latestWakeEvent.alarm_start).getTime();
  }

  const lastUpdatedAt = latestReading?.recorded_at ?? null;
  const deviceOnline =
    lastUpdatedAt != null && Date.now() - new Date(lastUpdatedAt).getTime() <= 30_000;

  return {
    currentDeviceLabel: latestDevice ? latestDevice.name || latestDevice.device_id : null,
    currentLightLux: latestReading?.light_lux ?? null,
    deviceOnline,
    lastUpdatedAt,
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
      const [
        { data: latestDevice, error: latestDeviceError },
        { data: latestReading, error: latestReadingError },
        { data: latestWakeEvent, error: latestWakeEventError },
      ] = await Promise.all([
        supabase
          .from("devices")
          .select("device_id, linked_at, name")
          .order("linked_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
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

      if (!active || latestDeviceError || latestReadingError || latestWakeEventError) return;
      setSummary(
        buildWakeSummary(latestDevice ?? null, latestReading ?? null, latestWakeEvent ?? null),
      );
    }

    loadSummary();
    const sensorChannel = supabase
      .channel("dashboard-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sensor_readings" },
        () => void loadSummary(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wake_events" },
        () => void loadSummary(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "devices" },
        () => void loadSummary(),
      )
      .subscribe();

    const timer = window.setInterval(loadSummary, 30_000);

    return () => {
      active = false;
      void supabase.removeChannel(sensorChannel);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Arduino Live-Dashboard</CardTitle>
            <CardDescription>
              Nur die Werte, die fuer euren Prototypen gerade wirklich wichtig sind.
            </CardDescription>
          </div>
          <Badge variant={summary?.deviceOnline ? "default" : "secondary"}>
            {summary?.deviceOnline ? "Geraet online" : "Warte auf Live-Daten"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Verknuepftes Geraet</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.currentDeviceLabel ?? "Noch keines"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Das zuletzt gekoppelte Arduino-Geraet.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Aktuelle Weckzeit</p>
              <p className="mt-2 text-2xl font-semibold">{summary.wakeTimeLabel ?? "--:-- Uhr"}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Direkt aus dem letzten Arduino-Upload.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Aktuelles Lichtlevel</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.currentLightLux != null ? `${summary.currentLightLux} lux` : "-"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {getLightStatus(summary.currentLightLux)}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Letzter abgeschlossener Weckvorgang</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatDuration(summary.wakeDurationMs)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {summary.wakeStartedAt
                  ? `Alarmstart: ${new Date(summary.wakeStartedAt).toLocaleString("de-DE")}`
                  : "Noch kein abgeschlossener Weckvorgang gespeichert."}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4 md:col-span-2 xl:col-span-4">
              <p className="text-xs text-muted-foreground">Letzte Synchronisation</p>
              <p className="mt-2 text-xl font-semibold">{formatLastSeen(summary.lastUpdatedAt)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Neue Sensordaten erscheinen automatisch, sobald dein ESP32 an Supabase sendet.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Noch keine persoenlichen Sensordaten vorhanden. Sobald dein Arduino Daten sendet,
            erscheinen hier die relevanten Live-Werte automatisch.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
