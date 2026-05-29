import { useState, FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  Sun,
  Moon,
  AlarmClock,
  Sparkles,
  Smartphone,
  Watch,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  Brain,
  TrendingUp,
  Mail,
  ChevronDown,
  Zap,
  ShieldCheck,
  BookOpen,
  Lock,
  Send,
} from "lucide-react";
import smartriseLogo from "@/assets/smartrise-logo.png";
import smartriseDevice from "@/assets/smartrise-device.png";

const nav = [
  { href: "#produkt", label: "Produkt" },
  { href: "#wissenschaft", label: "Wissenschaft" },
  { href: "#vergleich", label: "Vergleich" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#team", label: "Team" },
];

function AuthHeaderButton() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return (
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        Dashboard
      </Link>
    );
  }
  return (
    <Link
      to="/login"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
    >
      Anmelden
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5 text-lg font-display font-semibold">
          <img src={smartriseLogo} alt="SmartRise Logo" className="h-9 w-9 object-contain" />
          SmartRise
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <AuthHeaderButton />
          <a
            href="#preorder"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Preorder anfragen <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-12 md:pb-32 md:pt-28">
        <div className="md:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-soft)]">
            <span className="h-1.5 w-1.5 rounded-full bg-sunrise" />
            Jetzt im Pre-Launch
          </div>
          <h1 className="text-5xl leading-[1.02] font-semibold text-deep md:text-7xl">
            SmartRise One
          </h1>
          <p className="mt-5 max-w-xl text-xl font-medium text-foreground/80 md:text-2xl">
            Der smarte Wecker mit Aufsteh-Garantie für einen produktiven Morgen.
          </p>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            SmartRise One hilft dir, nicht wieder einzuschlafen, sondern wirklich aufzustehen
            und deinen Tag bewusst zu starten.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#produkt"
              className="inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3.5 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
            >
              Zum Produkt <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#wissenschaft"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 font-medium transition hover:bg-muted"
            >
              <BookOpen className="h-4 w-4" /> Wissenschaft ansehen
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-deep" /> Kein Snooze
            </div>
            <div className="flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-deep" /> Lichtsensor
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-deep" /> Sensorbasiert
            </div>
          </div>
        </div>

        <div className="relative md:col-span-5">
          <div className="relative mx-auto aspect-square max-w-md">
            <div
              className="absolute inset-0 rounded-full opacity-60 blur-3xl"
              style={{ background: "var(--gradient-sunrise)" }}
            />
            <img
              src={smartriseDevice}
              alt="SmartRise One Hardware-Prototyp mit LCD-Display und Keypad"
              className="relative h-full w-full object-contain drop-shadow-2xl"
            />
            <div className="absolute -right-2 -bottom-2 flex items-center gap-2 rounded-2xl bg-sunrise px-4 py-3 text-sunrise-foreground shadow-[var(--shadow-glow)] md:-right-4 md:bottom-4">
              <Sun className="h-5 w-5" />
              <div className="text-xs leading-tight">
                <div className="font-semibold">Lichtsensor aktiv</div>
                <div className="opacity-80">Aufsteh-Garantie</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const stats = [
    {
      value: "> 50 %",
      label: "der Menschen nutzen regelmäßig die Snooze-Funktion",
      src: "Journal of Sleep Research, 2022",
    },
    {
      value: "18 min",
      label: "gehen pro Tag durchschnittlich durch Snoozen verloren",
      src: "National Sleep Foundation",
    },
    {
      value: "↓ Qualität",
      label: "Schlafzyklus-Störungen können die Schlafqualität reduzieren",
      src: "Journal of Physiological Anthropology",
    },
  ];

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-deep">
            Das Problem
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
            Der Morgen entscheidet über den Tag - und die meisten verlieren ihn.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Snoozen fühlt sich an wie zusätzlicher Schlaf, ist aber das Gegenteil:
            fragmentierter Schlaf, träge Mornings, verlorene Zeit.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
            >
              <div className="font-display text-5xl font-semibold tabular-nums text-deep">
                {s.value}
              </div>
              <p className="mt-3 text-foreground/80">{s.label}</p>
              <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
                Quelle: {s.src}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Keine klassische Snooze-Funktion",
      desc: "Kein Wegdrücken, kein erneutes Einschlafen - die Aufsteh-Garantie greift sofort.",
    },
    {
      icon: Lightbulb,
      title: "Licht- & Sensorlogik",
      desc: "Lichtsensor erkennt Dunkelheit und aktiviert smarte Weckmechanismen zum echten Aufwachen.",
    },
    {
      icon: AlarmClock,
      title: "Bedienfeld & LCD-Display",
      desc: "Weckzeit per Keypad einstellbar, klare LCD-Anzeige - robust und intuitiv.",
    },
    {
      icon: Sparkles,
      title: "Gamified Awakening",
      desc: "Belohnungssystem für konsistente Morgenroutinen - geplant für die App-Erweiterung.",
    },
    {
      icon: Smartphone,
      title: "App-Integration",
      desc: "Schlafdaten, Statistiken und personalisierte Weckprofile direkt am Smartphone.",
    },
    {
      icon: Watch,
      title: "Smartwatch-Anbindung",
      desc: "Vibration am Handgelenk, Bewegungserkennung - Wecken ohne den Partner zu stören.",
    },
  ];

  return (
    <section id="produkt" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-deep">
            Das Produkt
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
            Eine Aufsteh-Garantie, die du nicht ignorieren kannst.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            SmartRise One kombiniert smarte Sensorik mit klarer Bedienung - gebaut für
            Menschen, die ihren Morgen ernst nehmen.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-7 transition hover:shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-deep/5 text-deep transition group-hover:bg-sunrise group-hover:text-sunrise-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-display font-semibold text-deep">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScienceSection() {
  const [open, setOpen] = useState(false);
  const facts = [
    {
      icon: Sun,
      title: "Morgenlicht synchronisiert die innere Uhr",
      desc: "Helles Licht am Morgen wirkt als stärkster Zeitgeber des zirkadianen Rhythmus und stabilisiert den Schlaf-Wach-Zyklus.",
      src: "Czeisler et al., Science - Morning Light & Circadian Rhythm",
    },
    {
      icon: Moon,
      title: "Licht reduziert Melatonin und fördert Wachheit",
      desc: "Lichtexposition nach dem Aufwachen kann die Melatoninproduktion senken und die Cortisol Awakening Response unterstützen.",
      src: "Journal of Physiological Anthropology - Light & Cortisol",
    },
    {
      icon: TrendingUp,
      title: "Strukturierte Morgen steigern Produktivität",
      desc: "Konsistente Morgenroutinen korrelieren mit höherer kognitiver Leistung und besseren Energielevels über den Tag.",
      src: "McKinsey - The Link Between Sleep, Energy & Productivity",
    },
    {
      icon: Brain,
      title: "Snoozen verstärkt Sleep Inertia",
      desc: "Wiederholtes Snoozen unterbricht REM-Phasen und kann das Gefühl morgendlicher Trägheit messbar verlängern.",
      src: "Journal of Sleep Research - Snooze Behavior & Sleep Inertia",
    },
  ];

  return (
    <section id="wissenschaft" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <span className="text-sm font-medium uppercase tracking-wider text-deep">
              Wissenschaft
            </span>
            <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
              Warum guter Morgen Wissenschaft ist - keine Esoterik.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Jede Aussage über Schlaf, Licht und Produktivität ist mit Quellen belegt.
              Keine Behauptungen ohne Beleg.
            </p>
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3.5 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
            >
              <BookOpen className="h-4 w-4" />
              Wissenschaftlich erklärt
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className={`grid gap-4 transition-all ${open ? "opacity-100" : "opacity-60"}`}>
              {(open ? facts : facts.slice(0, 1)).map((f) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                      style={{ background: "var(--gradient-sunrise)" }}
                    >
                      <f.icon className="h-5 w-5 text-sunrise-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-deep">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{f.desc}</p>
                      <p className="mt-4 border-l-2 border-sunrise pl-3 text-xs text-muted-foreground">
                        Quelle: {f.src}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              {!open ? (
                <p className="text-center text-sm text-muted-foreground">
                  Klicke auf <strong>„Wissenschaftlich erklärt“</strong>, um alle Studien &
                  Quellen einzusehen.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareSection() {
  const rows = [
    {
      label: "Klassischer Wecker",
      price: "ab 10 €",
      pros: ["Günstig", "Einfach"],
      cons: ["Leicht zu ignorieren", "Kein Snooze-Schutz"],
      highlight: false,
    },
    {
      label: "Smartphone-App",
      price: "0 - 5 €",
      pros: ["Flexibel", "Statistiken"],
      cons: ["Leicht ausschaltbar", "Ablenkung im Bett"],
      highlight: false,
    },
    {
      label: "SmartRise One",
      price: "29,99 €",
      pros: ["Sensorbasiert", "Routinen-orientiert", "Schwer zu umgehen"],
      cons: [],
      highlight: true,
    },
  ];

  return (
    <section id="vergleich" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-deep">
            Vergleich
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
            Andere wecken dich. SmartRise One bringt dich raus.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`rounded-2xl border p-7 ${
                r.highlight
                  ? "border-deep bg-deep text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-display font-semibold">{r.label}</h3>
                <span
                  className={`text-sm ${r.highlight ? "text-sunrise" : "text-muted-foreground"}`}
                >
                  {r.price}
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {r.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        r.highlight ? "text-sunrise" : "text-emerald-600"
                      }`}
                    />
                    {p}
                  </li>
                ))}
                {r.cons.map((c) => (
                  <li key={c} className="flex gap-2 opacity-70">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const phases = [
    {
      n: "01",
      title: "Basis-Wecker",
      desc: "Hardware-Prototyp mit LCD, Keypad, Lichtsensor und Aufsteh-Garantie.",
      status: "Heute",
    },
    {
      n: "02",
      title: "App-Integration & Gamification",
      desc: "Companion-App, Streaks, Belohnungssystem und personalisierte Weckprofile.",
      status: "2026",
    },
    {
      n: "03",
      title: "Smartwatch & Schlafanalyse",
      desc: "Vibration, Bewegungsdaten, REM-Erkennung für intelligentes Wecken.",
      status: "2026",
    },
    {
      n: "04",
      title: "Smarte Erweiterungen",
      desc: "Lichtwecker-Integration, KI-Routinen, Smart-Home-Anbindung.",
      status: "Vision",
    },
  ];

  return (
    <section id="roadmap" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-deep">
            Roadmap
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
            Von Hardware zu Habit-OS.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {phases.map((p) => (
            <div key={p.n} className="rounded-2xl border border-border bg-card p-7">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-display font-semibold text-sunrise">{p.n}</span>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  {p.status}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-display font-semibold text-deep">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    { name: "Pia", role: "Data Lead", initial: "P" },
    { name: "Henrik", role: "Tech Lead", initial: "H" },
    { name: "Murat", role: "Hardware Lead", initial: "M" },
  ];

  return (
    <section id="team" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="text-sm font-medium uppercase tracking-wider text-deep">
              Team & Kontakt
            </span>
            <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
              Drei Köpfe. Ein Morgen.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Interdisziplinäres Team aus Daten, Software und Hardware.
            </p>
            <a
              href="mailto:smartrise.clocks@gmail.com"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-medium transition hover:bg-muted"
            >
              <Mail className="h-4 w-4" /> smartrise.clocks@gmail.com
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-7">
            {team.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-full text-lg font-display font-semibold text-sunrise-foreground"
                  style={{ background: "var(--gradient-sunrise)" }}
                >
                  {m.initial}
                </div>
                <div>
                  <div className="font-display font-semibold text-deep">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreorderSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", source: "" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="preorder" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-deep">
            Preorder
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-deep md:text-5xl">
            SmartRise One vorbestellen
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Trage dich ein und erfahre als Erste:r, wann SmartRise One verfügbar ist.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Mit deiner Voranmeldung zeigst du Interesse an SmartRise One. Wir informieren dich
            über Produktstart, Verfügbarkeit und Neuigkeiten rund um unseren smarten Wecker
            für einen produktiven Morgen.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10 lg:col-span-3">
            {submitted ? (
              <div className="py-12 text-center">
                <div
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full"
                  style={{ background: "var(--gradient-sunrise)" }}
                >
                  <CheckCircle2 className="h-7 w-7 text-sunrise-foreground" />
                </div>
                <h3 className="mt-6 text-2xl font-display font-semibold text-deep">
                  Vielen Dank für dein Interesse an SmartRise One.
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Wir melden uns, sobald es Neuigkeiten zum Produktstart gibt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-deep">
                    Vorname / Name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Max Mustermann"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 transition focus:border-deep focus:ring-2 focus:ring-deep/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-deep">
                    E-Mail-Adresse
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="max@example.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 transition focus:border-deep focus:ring-2 focus:ring-deep/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="source" className="mb-2 block text-sm font-medium text-deep">
                    Wie bist du auf uns aufmerksam geworden?
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      required
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 transition focus:border-deep focus:ring-2 focus:ring-deep/30 focus:outline-none"
                    >
                      <option value="" disabled>
                        Bitte auswählen
                      </option>
                      <option>Social Media</option>
                      <option>Empfehlung</option>
                      <option>Schule / Hochschule</option>
                      <option>Präsentation / Pitch</option>
                      <option>Google / Internet</option>
                      <option>Sonstiges</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-deep px-6 py-4 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
                >
                  <Send className="h-4 w-4" /> Interesse absenden
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Keine Spam-Nachrichten. Nur relevante Updates zu SmartRise One.
                </p>
              </form>
            )}
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: "var(--gradient-sunrise)" }}
              >
                <Mail className="h-5 w-5 text-sunrise-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-display font-semibold text-deep">
                Direkt Kontakt aufnehmen
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fragen zum Produkt oder zur Vorbestellung? Schreib uns direkt.
              </p>
              <a
                href="mailto:smartrise.clocks@gmail.com"
                className="mt-4 inline-flex break-all font-medium text-deep hover:underline"
              >
                smartrise.clocks@gmail.com
              </a>
            </div>

            <div className="rounded-3xl bg-deep p-7 text-primary-foreground">
              <div className="flex items-center gap-2 text-sm font-medium text-sunrise">
                <Sparkles className="h-4 w-4" /> Was dich erwartet
              </div>
              <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sunrise" />
                  Frühzeitige Info zum Launch
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sunrise" />
                  Exklusiver Preorder-Zugang
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sunrise" />
                  Updates zu Features & Roadmap
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-deep p-12 text-center text-primary-foreground md:p-20">
          <div
            className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-sunrise)" }}
          />
          <div className="relative">
            <Sun className="mx-auto h-10 w-10 text-sunrise" />
            <h2 className="mt-6 text-4xl leading-tight font-display font-semibold md:text-6xl">
              Gewinne den Morgen.
              <br />
              Beherrsche den Tag.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/70">
              SmartRise One ist mehr als ein Wecker - es ist der Anfang einer neuen Routine.
            </p>
            <a
              href="#preorder"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-sunrise px-7 py-4 font-medium text-sunrise-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90"
            >
              Preorder anfragen <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <img src={smartriseLogo} alt="SmartRise Logo" className="h-7 w-7 object-contain" />
          © {new Date().getFullYear()} SmartRise. Alle Rechte vorbehalten.
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5" /> Pre-Launch · Hardware-Prototyp aktiv
        </div>
      </div>
    </footer>
  );
}

export default function SmartRiseLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProblemSection />
      <ProductSection />
      <ScienceSection />
      <CompareSection />
      <RoadmapSection />
      <TeamSection />
      <PreorderSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
