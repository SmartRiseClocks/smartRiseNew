import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Cpu } from "lucide-react";

type Device = { id: string; device_id: string; name: string | null; linked_at: string };

export function DeviceLink() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("devices")
      .select("id, device_id, name, linked_at")
      .order("linked_at", { ascending: false });
    if (error) toast.error(error.message);
    else setDevices(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const deviceId = String(fd.get("device_id") ?? "").trim();
    const name = String(fd.get("name") ?? "").trim();
    if (!deviceId) return;
    if (deviceId.length > 64 || !/^[A-Za-z0-9_:-]+$/.test(deviceId)) {
      toast.error("Geräte-ID darf nur Buchstaben, Zahlen, _ : - enthalten (max. 64).");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("devices")
      .insert({ user_id: user.id, device_id: deviceId, name: name || null });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Gerät verknüpft.");
      (e.target as HTMLFormElement).reset();
      load();
    }
  }

  async function handleRemove(id: string) {
    const { error } = await supabase.from("devices").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Gerät entkoppelt.");
      load();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Arduino-Gerät verknüpfen</CardTitle>
        <CardDescription>Verbinde deinen Arduino Nano über die eindeutige Geräte-ID mit deinem Konto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="device_id">Geräte-ID</Label>
            <Input id="device_id" name="device_id" placeholder="z.B. SR-NANO-A1B2C3" required maxLength={64} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name (optional)</Label>
            <Input id="name" name="name" placeholder="Mein Schlafzimmer" maxLength={80} />
          </div>
          <Button type="submit" disabled={busy}>{busy ? "…" : "Verknüpfen"}</Button>
        </form>

        <div>
          <h4 className="text-sm font-medium mb-2">Verknüpfte Geräte</h4>
          {devices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Geräte verknüpft.</p>
          ) : (
            <ul className="divide-y divide-border border border-border rounded-md">
              {devices.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{d.name || d.device_id}</p>
                    <p className="text-xs text-muted-foreground">{d.device_id} · seit {new Date(d.linked_at).toLocaleDateString("de-DE")}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(d.id)} aria-label="Entkoppeln">
                    <Trash2 className="w-4 h-4" />
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
