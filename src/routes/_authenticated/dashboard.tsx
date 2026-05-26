import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArduinoSetupCard } from "@/components/dashboard/ArduinoSetupCard";
import { WakeChart } from "@/components/dashboard/WakeChart";
import { AvgDelayCard } from "@/components/dashboard/AvgDelayCard";
import { FeedbackForm } from "@/components/dashboard/FeedbackForm";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmartRise One" },
      { name: "description", content: "Dein persönliches SmartRise-Dashboard mit Aufstehzeiten und Gerätesteuerung." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-lg">SmartRise</Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut()}>Abmelden</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Übersicht deiner SmartRise-Daten.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WakeChart />
          </div>
          <AvgDelayCard />
        </div>

        <ArduinoSetupCard />

        <div className="grid gap-6">
          <FeedbackForm />
        </div>
      </main>
    </div>
  );
}
