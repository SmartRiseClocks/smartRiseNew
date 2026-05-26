import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

type LatestReading = {
  humidity_pct: number | null;
  light_lux: number | null;
  motion_detected: boolean | null;
  recorded_at: string;
  temperature_c: number | null;
};

export function AvgDelayCard() {
  const [reading, setReading] = useState<LatestReading | null>(null);

  useEffect(() => {
    supabase
      .from("sensor_readings")
      .select("temperature_c, humidity_pct, light_lux, motion_detected, recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) return;
        setReading(data);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Letzter Sensorscan
        </CardTitle>
        <CardDescription>Deine aktuellsten persoenlichen Messwerte im Ueberblick.</CardDescription>
      </CardHeader>
      <CardContent>
        {reading ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Temperatur</p>
                <p className="text-2xl font-semibold">{reading.temperature_c != null ? `${reading.temperature_c} C` : "-"}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Luftfeuchte</p>
                <p className="text-2xl font-semibold">{reading.humidity_pct != null ? `${reading.humidity_pct} %` : "-"}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Helligkeit</p>
                <p className="text-2xl font-semibold">{reading.light_lux != null ? `${reading.light_lux} lux` : "-"}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Bewegung</p>
                <p className="text-2xl font-semibold">{reading.motion_detected == null ? "-" : reading.motion_detected ? "Ja" : "Nein"}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Letzte Aktualisierung: {new Date(reading.recorded_at).toLocaleString("de-DE")}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Noch keine persoenlichen Sensorwerte vorhanden. Sobald dein Arduino Daten uebertraegt, wird hier dein letzter Sensorscan angezeigt.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
