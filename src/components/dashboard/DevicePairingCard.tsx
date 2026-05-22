import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link2, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

type PairingCode = {
  id: string;
  code: string;
  expires_at: string;
  claimed_at: string | null;
};

function formatRemaining(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "abgelaufen";
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")} min`;
}

export function DevicePairingCard() {
  const [pairing, setPairing] = useState<PairingCode | null>(null);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(Date.now());

  async function load() {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("device_pairing_codes")
      .select("id, code, expires_at, claimed_at")
      .is("claimed_at", null)
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      toast.error(error.message);
      return;
    }

    setPairing(data);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pairing && new Date(pairing.expires_at).getTime() <= tick) {
      setPairing(null);
    }
  }, [pairing, tick]);

  async function handleGenerate() {
    setBusy(true);
    const { data, error } = await supabase.rpc("issue_device_pairing_code");
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    const next = data?.[0];
    if (!next) {
      toast.error("Kopplungscode konnte nicht erstellt werden.");
      return;
    }

    setPairing({
      id: next.pairing_id,
      code: next.code,
      expires_at: next.expires_at,
      claimed_at: null,
    });
    toast.success("Neuer Kopplungscode erstellt.");
  }

  async function handleDelete() {
    if (!pairing) return;
    setBusy(true);
    const { error } = await supabase.from("device_pairing_codes").delete().eq("id", pairing.id);
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setPairing(null);
    toast.success("Kopplungscode entfernt.");
  }

  const isExpired = pairing ? new Date(pairing.expires_at).getTime() <= tick : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Arduino per Einmalcode koppeln
        </CardTitle>
        <CardDescription>
          Erzeuge einen kurzen Einmalcode. Spaeter sendet dein Arduino diesen Code zusammen mit seiner
          eigenen Geraete-ID an dein Backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          {pairing && !isExpired ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary" className="gap-2 px-3 py-1 text-base">
                  <ShieldCheck className="h-4 w-4" />
                  Aktiver Code
                </Badge>
                <span className="text-sm text-muted-foreground">
                  gueltig fuer {formatRemaining(pairing.expires_at)}
                </span>
              </div>
              <div className="rounded-md border border-dashed border-primary/40 bg-background px-4 py-5 text-center">
                <p className="text-4xl font-semibold tracking-[0.4em] text-foreground">{pairing.code}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Dieser Code ist nur voruebergehend gueltig und wird fuer genau ein Geraet verwendet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">Noch kein aktiver Kopplungscode vorhanden.</p>
              <p className="text-sm text-muted-foreground">
                Erstelle hier deinen naechsten Einmalcode. Die Arduino-Anbindung kann spaeter direkt
                darauf aufsetzen.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleGenerate} disabled={busy}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {pairing && !isExpired ? "Code erneuern" : "Code erzeugen"}
          </Button>
          {pairing && !isExpired ? (
            <Button variant="outline" onClick={handleDelete} disabled={busy}>
              <Trash2 className="mr-2 h-4 w-4" />
              Code entfernen
            </Button>
          ) : null}
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>1. User meldet sich im Dashboard an.</p>
          <p>2. User erzeugt einen sechsstelligen Einmalcode.</p>
          <p>3. Arduino sendet spaeter `device_id + pairing_code` an die API.</p>
          <p>4. Danach werden Sensorwerte automatisch dem richtigen Konto zugeordnet.</p>
        </div>
      </CardContent>
    </Card>
  );
}
