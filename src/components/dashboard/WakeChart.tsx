import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Row = { day: string; value: number };

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function startOfWeek(): Date {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

export function WakeChart() {
  const [data, setData] = useState<Row[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const since = startOfWeek().toISOString();
    supabase
      .from("sensor_readings")
      .select("recorded_at, temperature_c")
      .gte("recorded_at", since)
      .not("temperature_c", "is", null)
      .order("recorded_at", { ascending: true })
      .then(({ data: rows, error }) => {
        if (error || !rows || rows.length === 0) {
          setHasData(false);
          return;
        }

        const buckets: Record<number, { sum: number; count: number }> = {};
        rows.forEach((row) => {
          const ref = new Date(row.recorded_at);
          const dow = (ref.getDay() + 6) % 7;
          buckets[dow] = buckets[dow] || { sum: 0, count: 0 };
          buckets[dow].sum += Number(row.temperature_c ?? 0);
          buckets[dow].count += 1;
        });

        const nextData = DAYS.map((day, index) => {
          const bucket = buckets[index];
          const value = bucket ? Math.round((bucket.sum / bucket.count) * 10) / 10 : 0;
          return { day, value };
        });

        setData(nextData);
        setHasData(true);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deine Temperaturwerte dieser Woche</CardTitle>
        <CardDescription>
          {hasData
            ? "Durchschnittliche Temperatur pro Wochentag aus deinen persoenlichen Sensorwerten."
            : "Hier erscheinen deine persoenlichen Temperaturwerte, sobald dein Arduino Daten sendet."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value} C`} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)} C`, "Temperatur"]} />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Noch keine persoenlichen Temperaturwerte vorhanden. Nach der Arduino-Kopplung werden hier automatisch deine echten Sensorwerte angezeigt.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
