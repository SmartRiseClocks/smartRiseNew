import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function AvgDelayCard() {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isDummy, setIsDummy] = useState(true);

  useEffect(() => {
    const since = new Date(Date.now() - 7 * 86400_000).toISOString();
    supabase
      .from("wake_events")
      .select("alarm_start, light_on")
      .gte("alarm_start", since)
      .not("light_on", "is", null)
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setSeconds(132); // dummy: 2m 12s
          setIsDummy(true);
          return;
        }
        const diffs = data.map((r) => (new Date(r.light_on!).getTime() - new Date(r.alarm_start).getTime()) / 1000);
        const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
        setSeconds(Math.max(0, Math.round(avg)));
        setIsDummy(false);
      });
  }, []);

  const m = seconds == null ? 0 : Math.floor(seconds / 60);
  const s = seconds == null ? 0 : seconds % 60;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Ø Zeit bis Licht an</CardTitle>
        <CardDescription>Wecker → Licht eingeschaltet (letzte 7 Tage)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-semibold tracking-tight">
          {m}<span className="text-2xl text-muted-foreground">m</span> {String(s).padStart(2, "0")}<span className="text-2xl text-muted-foreground">s</span>
        </div>
        {isDummy && <p className="mt-3 text-xs text-muted-foreground">Beispielwert — echte Daten erscheinen sobald dein Gerät Events sendet.</p>}
      </CardContent>
    </Card>
  );
}
