import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LatestSensorReading = {
  alarm_active: boolean | null;
  alarm_hour: number | null;
  alarm_minute: number | null;
  light_lux: number | null;
  recorded_at: string;
};

type DeviceRow = {
  device_id: string;
  linked_at: string;
  name: string | null;
};

type DashboardSummary = {
  alarmActive: boolean;
  currentDeviceLabel: string | null;
  currentLightLux: number | null;
  deviceOnline: boolean;
  lastUpdatedAt: string | null;
  wakeTimeLabel: string | null;
};

function formatWakeTime(hour: number | null, minute: number | null) {
  if (hour == null || minute == null) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} Uhr`;
}

function formatLastSeen(timestamp: string | null) {
  if (!timestamp) return "Noch keine Sensordaten";
  return new Date(timestamp).toLocaleString("de-DE");
}

function getLightStatus(lightLux: number | null) {
  if (lightLux == null) return "Warte auf den ersten Messwert";
  if (lightLux <= 420) return "Dunkel genug zum Klingeln";
  if (lightLux <= 1500) return "Raum wird heller";
  return "Raum ist hell";
}

function buildSummary(
  latestDevice: DeviceRow | null,
  latestReading: LatestSensorReading | null,
): DashboardSummary {
  const lastUpdatedAt = latestReading?.recorded_at ?? null;
  const deviceOnline =
    lastUpdatedAt != null && Date.now() - new Date(lastUpdatedAt).getTime() <= 30_000;

  return {
    alarmActive: latestReading?.alarm_active === true,
    currentDeviceLabel: latestDevice ? latestDevice.name || latestDevice.device_id : null,
    currentLightLux: latestReading?.light_lux ?? null,
    deviceOnline,
    lastUpdatedAt,
    wakeTimeLabel: formatWakeTime(latestReading?.alarm_hour ?? null, latestReading?.alarm_minute ?? null),
  };
}

export function WakeChart() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      const [{ data: latestDevice, error: latestDeviceError }, { data: latestReading, error: latestReadingError }] =
        await Promise.all([
          supabase
            .from("devices")
            .select("device_id, linked_at, name")
            .order("linked_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("sensor_readings")
            .select("light_lux, alarm_hour, alarm_minute, alarm_active, recorded_at")
            .order("recorded_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

      if (!active || latestDeviceError || latestReadingError) return;
      setSummary(buildSummary(latestDevice ?? null, latestReading ?? null));
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
              Angezeigt werden nur die wirklich gesendeten Arduino-Werte: Licht und Weckzeit.
            </CardDescription>
          </div>
          <Badge variant={summary?.deviceOnline ? "default" : "secondary"}>
            {summary?.deviceOnline ? "Gerät online" : "Warte auf Live-Daten"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Verknüpftes Gerät</p>
              <p className="mt-2 text-2xl font-semibold">{summary.currentDeviceLabel ?? "Noch keines"}</p>
              <p className="mt-2 text-sm text-muted-foreground">Das zuletzt gekoppelte Arduino-Gerät.</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Aktuelle Weckzeit</p>
              <p className="mt-2 text-2xl font-semibold">{summary.wakeTimeLabel ?? "--:-- Uhr"}</p>
              <p className="mt-2 text-sm text-muted-foreground">Direkt aus dem letzten Arduino-Upload.</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Aktuelles Lichtlevel</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.currentLightLux != null ? `${summary.currentLightLux} lux` : "-"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{getLightStatus(summary.currentLightLux)}</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Alarmstatus</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.alarmActive ? "Alarm aktiv" : "Alarm aus"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dieser Wert kommt direkt als Live-Flag vom Arduino.
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
            Noch keine persönlichen Sensordaten vorhanden. Sobald dein Arduino Daten sendet,
            erscheinen hier Lichtwert und Weckzeit live.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
