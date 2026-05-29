import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Anmelden - SmartRise One" },
      {
        name: "description",
        content: "Melde dich bei deinem SmartRise-Konto an oder registriere dich.",
      },
    ],
  }),
  component: LoginPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Bitte gültige E-Mail eingeben").max(255),
  password: z.string().min(8, "Mindestens 8 Zeichen").max(128),
});

function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = credSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await signIn(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (error) toast.error(error);
    else {
      toast.success("Willkommen zurück!");
      navigate({ to: "/dashboard" });
    }
  }

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const displayName = String(fd.get("displayName") ?? "").trim().slice(0, 80);
    const parsed = credSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await signUp(
      parsed.data.email,
      parsed.data.password,
      displayName || undefined,
    );
    setBusy(false);
    if (error) toast.error(error);
    else {
      toast.success("Konto erstellt - du bist eingeloggt.");
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Zurück zur Startseite
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-foreground">SmartRise Konto</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Melde dich an oder registriere ein neues Konto.
        </p>

        <Tabs defaultValue="signin" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Anmelden</TabsTrigger>
            <TabsTrigger value="signup">Registrieren</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="si-email">E-Mail</Label>
                <Input id="si-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="si-password">Passwort</Label>
                <Input
                  id="si-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Wird angemeldet…" : "Anmelden"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="su-name">Anzeigename (optional)</Label>
                <Input id="su-name" name="displayName" type="text" maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">E-Mail</Label>
                <Input id="su-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-password">Passwort (min. 8 Zeichen)</Label>
                <Input
                  id="su-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Konto wird erstellt…" : "Konto erstellen"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
