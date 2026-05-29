import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

type LatestReading = {
  light_lux: number | null;
  recorded_at: string;
};

function getLightStatus(lightLux: number | null) {
  if (lightLux == null) return "Noch keine Messung";
  if (lightLux <= 420) return "Dunkel genug zum Klingeln";
  if (lightLux <= 1500) return "Raum wird heller";
  return "Helles Umgebungslicht";
}

export function AvgDelayCard() {
  const [reading, setReading] = useState<LatestReading | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReading() {
      const { data, error } = await supabase
        .from("sensor_readings")
        .select("light_lux, recorded_at")
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active || error || !data) return;
      setReading(data);
    }

    loadReading();
    const timer = window.setInterval(loadReading, 10_000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Arduino Lichtstatus
        </CardTitle>
        <CardDescription>Zusatzansicht zum aktuell gemeldeten Lichtwert deines Arduino.</CardDescription>
      </CardHeader>
      <CardContent>
        {reading ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Aktuelles Lichtlevel</p>
              <p className="mt-2 text-3xl font-semibold">
                {reading.light_lux != null ? `${reading.light_lux} lux` : "-"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{getLightStatus(reading.light_lux)}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Letzte Aktualisierung: {new Date(reading.recorded_at).toLocaleString("de-DE")}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Noch keine persoenlichen Sensorwerte vorhanden. Sobald dein Arduino Daten uebertraegt, erscheint hier dein
            aktueller Lichtstatus.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
