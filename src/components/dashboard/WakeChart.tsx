import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Row = { day: string; minutes: number; label: string };

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// Dummy fallback: realistic wake times around 6:30-7:30
const DUMMY: Row[] = DAYS.map((d, i) => {
  const mins = 6 * 60 + 30 + ((i * 17) % 60);
  return { day: d, minutes: mins, label: `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}` };
});

function startOfWeek(): Date {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Mon=0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

export function WakeChart() {
  const [data, setData] = useState<Row[]>(DUMMY);
  const [isDummy, setIsDummy] = useState(true);

  useEffect(() => {
    const since = startOfWeek().toISOString();
    supabase
      .from("wake_events")
      .select("alarm_start, light_on")
      .gte("alarm_start", since)
      .order("alarm_start", { ascending: true })
      .then(({ data: rows, error }) => {
        if (error || !rows || rows.length === 0) return;
        const buckets: Record<number, { sum: number; count: number }> = {};
        rows.forEach((r) => {
          const ref = new Date(r.light_on ?? r.alarm_start);
          const dow = (ref.getDay() + 6) % 7;
          const mins = ref.getHours() * 60 + ref.getMinutes();
          buckets[dow] = buckets[dow] || { sum: 0, count: 0 };
          buckets[dow].sum += mins;
          buckets[dow].count += 1;
        });
        const real: Row[] = DAYS.map((d, i) => {
          const b = buckets[i];
          const mins = b ? Math.round(b.sum / b.count) : 0;
          return { day: d, minutes: mins, label: mins ? `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}` : "—" };
        });
        setData(real);
        setIsDummy(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aufstehzeiten dieser Woche</CardTitle>
        <CardDescription>
          {isDummy ? "Beispieldaten — sobald dein Gerät Events sendet, erscheinen hier echte Werte." : "Durchschnittliche Aufstehzeit pro Wochentag."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[5 * 60, 9 * 60]}
                tickFormatter={(m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`}
              />
              <Tooltip
                formatter={(v: number) => [`${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`, "Aufstehzeit"]}
              />
              <Bar dataKey="minutes" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
