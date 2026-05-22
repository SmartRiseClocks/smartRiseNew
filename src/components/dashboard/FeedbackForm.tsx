import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

export function FeedbackForm() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const message = String(fd.get("message") ?? "").trim();
    if (message.length < 3) {
      toast.error("Bitte mindestens 3 Zeichen eingeben.");
      return;
    }
    if (message.length > 2000) {
      toast.error("Maximal 2000 Zeichen.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("feedback").insert({ user_id: user.id, message });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Danke für dein Feedback!");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Feedback</CardTitle>
        <CardDescription>Was läuft gut, was sollten wir verbessern?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea name="message" placeholder="Dein Feedback an das SmartRise-Team…" rows={5} maxLength={2000} required />
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>{busy ? "Wird gesendet…" : "Absenden"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
