import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Cpu, Link2, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

type PairingCode = {
  id: string;
  code: string;
  expires_at: string;
};

type Device = {
  id: string;
  device_id: string;
  linked_at: string;
  name: string | null;
};

type SupabaseLikeError = {
  code?: string;
  message?: string;
};

function createSixDigitCode() {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

function formatRemaining(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "abgelaufen";
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")} min`;
}

function getPairingSetupErrorMessage(error: SupabaseLikeError | null | undefined) {
  if (!error) return null;

  if (error.code === "PGRST202" || error.code === "PGRST205") {
    return "Im verbundenen Supabase-Projekt fehlen noch die SmartRise-Migrationen fuer Pairing und Geraete. Bitte die Datenbank-Migrationen auf das produktive Projekt anwenden.";
  }

  return error.message ?? null;
}

export function ArduinoSetupCard() {
  const [pairing, setPairing] = useState<PairingCode | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(Date.now());

  async function loadPairing() {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("device_pairing_codes")
      .select("id, code, expires_at")
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

  async function loadDevices() {
    const { data, error } = await supabase
      .from("devices")
      .select("id, device_id, linked_at, name")
      .order("linked_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setDevices(data ?? []);
  }

  useEffect(() => {
    loadPairing();
    loadDevices();
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

  async function createPairingCodeFallback() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Du musst eingeloggt sein, um einen Kopplungscode zu erzeugen.");
    }

    const nowIso = new Date().toISOString();

    const { error: deleteError } = await supabase
      .from("device_pairing_codes")
      .delete()
      .is("claimed_at", null)
      .gt("expires_at", nowIso)
      .eq("user_id", user.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = createSixDigitCode();
      const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();

      const { data, error } = await supabase
        .from("device_pairing_codes")
        .insert({
          user_id: user.id,
          code,
          expires_at: expiresAt,
        })
        .select("id, code, expires_at")
        .single();

      if (!error && data) {
        return data;
      }

      if (error && error.code !== "23505") {
        throw new Error(error.message);
      }
    }

    throw new Error("Kopplungscode konnte nach mehreren Versuchen nicht erstellt werden.");
  }

  async function handleGenerate() {
    setBusy(true);
    try {
      const { data, error } = await supabase.rpc("issue_device_pairing_code");
      const setupErrorMessage = getPairingSetupErrorMessage(error);

      if (!error) {
        const next = data?.[0];
        if (!next) {
          throw new Error("Kopplungscode konnte nicht erstellt werden.");
        }

        setPairing({
          id: next.pairing_id,
          code: next.code,
          expires_at: next.expires_at,
        });
        toast.success("Neuer Kopplungscode erstellt.");
        return;
      }

      try {
        const fallbackResult = await createPairingCodeFallback();
        setPairing(fallbackResult);
        toast.success("Neuer Kopplungscode erstellt.");
      } catch (fallbackError) {
        const fallbackMessage =
          fallbackError instanceof Error ? fallbackError.message : "Kopplungscode konnte nicht erstellt werden.";
        throw new Error(setupErrorMessage ?? fallbackMessage);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kopplungscode konnte nicht erstellt werden.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteCode() {
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

  async function handleRemoveDevice(id: string) {
    const { error } = await supabase.from("devices").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Geraet entfernt.");
    loadDevices();
  }

  const hasActiveCode = Boolean(pairing && new Date(pairing.expires_at).getTime() > tick);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          Arduino-Kopplung
        </CardTitle>
        <CardDescription>
          Ein zentraler Bereich fuer alles, was du spaeter zur Arduino-Verbindung brauchst.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            {hasActiveCode && pairing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="secondary" className="gap-2 px-3 py-1 text-base">
                    <ShieldCheck className="h-4 w-4" />
                    Aktiver Einmalcode
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    gueltig fuer {formatRemaining(pairing.expires_at)}
                  </span>
                </div>
                <div className="rounded-md border border-dashed border-primary/40 bg-background px-4 py-5 text-center">
                  <p className="text-4xl font-semibold tracking-[0.4em] text-foreground">{pairing.code}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Diesen Code braucht dein Arduino spaeter zusammen mit seiner festen `device_id`.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">Noch kein aktiver Kopplungscode vorhanden.</p>
                <p className="text-sm text-muted-foreground">
                  Sobald dein Arduino bereit ist, erzeugst du hier einen neuen sechsstelligen Einmalcode.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Spaeter im Arduino noetig</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Eine feste `device_id` pro Arduino.</p>
              <p>2. Der Einmalcode aus diesem Bereich.</p>
              <p>3. WLAN oder Internet-Zugang am Geraet.</p>
              <p>4. Eine Anfrage, die `device_id + pairing_code` an dein Backend sendet.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleGenerate} disabled={busy}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {hasActiveCode ? "Code erneuern" : "Code erzeugen"}
          </Button>
          {hasActiveCode ? (
            <Button variant="outline" onClick={handleDeleteCode} disabled={busy}>
              <Trash2 className="mr-2 h-4 w-4" />
              Code entfernen
            </Button>
          ) : null}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Bereits gekoppelte Geraete</h4>
          {devices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Noch kein Arduino gekoppelt. Nach der spaeteren Arduino-Verbindung erscheint dein Geraet hier automatisch.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border">
              {devices.map((device) => (
                <li key={device.id} className="flex items-center justify-between gap-4 px-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{device.name || device.device_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {device.device_id} · seit {new Date(device.linked_at).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveDevice(device.id)}>
                    Entfernen
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
