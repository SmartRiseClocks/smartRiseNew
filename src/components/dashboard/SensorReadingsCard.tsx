import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

type ReadingRow = {
  id: string;
  recorded_at: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  light_lux: number | null;
  motion_detected: boolean | null;
  source: string;
  devices: { name: string | null; device_id: string } | null;
};

function formatValue(label: string, value: number | boolean | null, unit = "") {
  if (value == null) return `${label}: -`;
  if (typeof value === "boolean") return `${label}: ${value ? "Ja" : "Nein"}`;
  return `${label}: ${value}${unit}`;
}

export function SensorReadingsCard() {
  const [rows, setRows] = useState<ReadingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("sensor_readings")
      .select("id, recorded_at, temperature_c, humidity_pct, light_lux, motion_detected, source, devices(name, device_id)")
      .order("recorded_at", { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        setRows(data as ReadingRow[]);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Sensorwerte vorbereitet
        </CardTitle>
        <CardDescription>
          Diese Tabelle ist jetzt bereit fuer echte Arduino-Daten. Sobald dein Geraet Werte sendet,
          erscheinen sie hier im Dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? <p className="text-sm text-muted-foreground">Lade Sensorstatus…</p> : null}
        {!loading && rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Noch keine Sensorwerte gespeichert. Die Datenbankstruktur ist vorbereitet, es fehlt nur
            noch die Arduino-Uebertragung.
          </div>
        ) : null}
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  {row.devices?.name || row.devices?.device_id || "Unbekanntes Geraet"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(row.recorded_at).toLocaleString("de-DE")}
                </p>
              </div>
              <Badge variant="outline">{row.source}</Badge>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p>{formatValue("Temperatur", row.temperature_c, " °C")}</p>
              <p>{formatValue("Luftfeuchte", row.humidity_pct, " %")}</p>
              <p>{formatValue("Helligkeit", row.light_lux, " lux")}</p>
              <p>{formatValue("Bewegung", row.motion_detected)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
