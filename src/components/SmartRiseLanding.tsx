import { useState, FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  Sun, Moon, AlarmClock, Sparkles, Smartphone, Watch, Activity,
  CheckCircle2, XCircle, ArrowRight, Lightbulb, Brain, TrendingUp,
  Mail, ChevronDown, Zap, ShieldCheck, BookOpen, Lock, Send,
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
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium border border-border bg-card px-4 py-2 rounded-full hover:bg-muted transition">
        Dashboard
      </Link>
    );
  }
  return (
    <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium border border-border bg-card px-4 py-2 rounded-full hover:bg-muted transition">
      Anmelden
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 font-display font-semibold text-lg">
          <img src={smartriseLogo} alt="SmartRise Logo" className="w-9 h-9 object-contain" />
          SmartRise
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">{n.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <AuthHeaderButton />
          <a href="#preorder" className="inline-flex items-center gap-1.5 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition">
            Preorder anfragen <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ backgroundImage: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-card border border-border rounded-full px-3 py-1.5 mb-6 shadow-[var(--shadow-soft)]">
            <span className="w-1.5 h-1.5 rounded-full bg-sunrise" />
            Jetzt im Pre-Launch
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-deep leading-[1.02]">
            SmartRise One
          </h1>
          <p className="mt-5 text-xl md:text-2xl text-foreground/80 font-medium max-w-xl">
            Der smarte Wecker mit Aufsteh-Garantie für einen produktiven Morgen.
          </p>
          <p className="mt-4 text-base text-muted-foreground max-w-lg">
            SmartRise One hilft dir, nicht wieder einzuschlafen, sondern wirklich aufzustehen
            und deinen Tag bewusst zu starten.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#produkt" className="inline-flex items-center gap-2 bg-deep text-primary-foreground px-6 py-3.5 rounded-full font-medium hover:opacity-90 transition shadow-[var(--shadow-soft)]">
              Zum Produkt <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#wissenschaft" className="inline-flex items-center gap-2 bg-card border border-border px-6 py-3.5 rounded-full font-medium hover:bg-muted transition">
              <BookOpen className="w-4 h-4" /> Wissenschaft ansehen
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-deep" /> Kein Snooze</div>
            <div className="flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-deep" /> Lichtsensor</div>
            <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-deep" /> Sensorbasiert</div>
          </div>
        </div>

        {/* Product render */}
        <div className="md:col-span-5 relative">
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-60" style={{ background: "var(--gradient-sunrise)" }} />
            <img
              src={smartriseDevice}
              alt="SmartRise One Hardware-Prototyp mit LCD-Display und Keypad"
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 md:bottom-4 md:-right-4 bg-sunrise text-sunrise-foreground rounded-2xl px-4 py-3 shadow-[var(--shadow-glow)] flex items-center gap-2">
              <Sun className="w-5 h-5" />
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
    { value: "> 50 %", label: "der Menschen nutzen regelmäßig die Snooze-Funktion", src: "Journal of Sleep Research, 2022" },
    { value: "18 min", label: "gehen pro Tag durchschnittlich durch Snoozen verloren", src: "National Sleep Foundation" },
    { value: "↓ Qualität", label: "Schlafzyklus-Störungen können die Schlafqualität reduzieren", src: "Journal of Physiological Anthropology" },
  ];
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-deep uppercase tracking-wider">Das Problem</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">
            Der Morgen entscheidet über den Tag — und die meisten verlieren ihn.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Snoozen fühlt sich an wie zusätzlicher Schlaf, ist aber das Gegenteil:
            fragmentierter Schlaf, träge Mornings, verlorene Zeit.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {stats.map((s) => (
            <div key={s.value} className="bg-card border border-border rounded-2xl p-7 shadow-[var(--shadow-soft)]">
              <div className="font-display text-5xl font-semibold text-deep tabular-nums">{s.value}</div>
              <p className="mt-3 text-foreground/80">{s.label}</p>
              <p className="mt-5 text-xs text-muted-foreground border-t border-border pt-3">Quelle: {s.src}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  const features = [
    { icon: ShieldCheck, title: "Keine klassische Snooze-Funktion", desc: "Kein Wegdrücken, kein erneutes Einschlafen — die Aufsteh-Garantie greift sofort." },
    { icon: Lightbulb, title: "Licht- & Sensorlogik", desc: "Lichtsensor erkennt Dunkelheit und aktiviert smarte Weckmechanismen zum echten Aufwachen." },
    { icon: AlarmClock, title: "Bedienfeld & LCD-Display", desc: "Weckzeit per Keypad einstellbar, klare LCD-Anzeige — robust und intuitiv." },
    { icon: Sparkles, title: "Gamified Awakening", desc: "Belohnungssystem für konsistente Morgenroutinen — geplant für die App-Erweiterung." },
    { icon: Smartphone, title: "App-Integration", desc: "Schlafdaten, Statistiken und personalisierte Weckprofile direkt am Smartphone." },
    { icon: Watch, title: "Smartwatch-Anbindung", desc: "Vibration am Handgelenk, Bewegungserkennung — Wecken ohne den Partner zu stören." },
  ];
  return (
    <section id="produkt" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-deep uppercase tracking-wider">Das Produkt</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">
            Eine Aufsteh-Garantie, die du nicht ignorieren kannst.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            SmartRise One kombiniert smarte Sensorik mit klarer Bedienung — gebaut für
            Menschen, die ihren Morgen ernst nehmen.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group bg-card border border-border rounded-2xl p-7 hover:shadow-[var(--shadow-soft)] transition">
              <div className="w-11 h-11 rounded-xl bg-deep/5 grid place-items-center text-deep group-hover:bg-sunrise group-hover:text-sunrise-foreground transition">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-deep">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
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
      src: "Czeisler et al., Science — Morning Light & Circadian Rhythm",
    },
    {
      icon: Moon,
      title: "Licht reduziert Melatonin und fördert Wachheit",
      desc: "Lichtexposition nach dem Aufwachen kann die Melatoninproduktion senken und die Cortisol Awakening Response unterstützen.",
      src: "Journal of Physiological Anthropology — Light & Cortisol",
    },
    {
      icon: TrendingUp,
      title: "Strukturierte Morgen steigern Produktivität",
      desc: "Konsistente Morgenroutinen korrelieren mit höherer kognitiver Leistung und besseren Energielevels über den Tag.",
      src: "McKinsey — The Link Between Sleep, Energy & Productivity",
    },
    {
      icon: Brain,
      title: "Snoozen verstärkt Sleep Inertia",
      desc: "Wiederholtes Snoozen unterbricht REM-Phasen und kann das Gefühl morgendlicher Trägheit messbar verlängern.",
      src: "Journal of Sleep Research — Snooze Behavior & Sleep Inertia",
    },
  ];
  return (
    <section id="wissenschaft" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <span className="text-sm font-medium text-deep uppercase tracking-wider">Wissenschaft</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">
              Warum guter Morgen Wissenschaft ist — keine Esoterik.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Jede Aussage über Schlaf, Licht und Produktivität ist mit Quellen belegt.
              Keine Behauptungen ohne Beleg.
            </p>
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-8 inline-flex items-center gap-2 bg-deep text-primary-foreground px-6 py-3.5 rounded-full font-medium hover:opacity-90 transition shadow-[var(--shadow-soft)]"
            >
              <BookOpen className="w-4 h-4" />
              Wissenschaftlich erklärt
              <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className={`grid gap-4 transition-all ${open ? "opacity-100" : "opacity-60"}`}>
              {(open ? facts : facts.slice(0, 1)).map((f) => (
                <article key={f.title} className="bg-card border border-border rounded-2xl p-7 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--gradient-sunrise)" }}>
                      <f.icon className="w-5 h-5 text-sunrise-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-deep">{f.title}</h3>
                      <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{f.desc}</p>
                      <p className="mt-4 text-xs text-muted-foreground border-l-2 border-sunrise pl-3">
                        Quelle: {f.src}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              {!open && (
                <p className="text-sm text-muted-foreground text-center">
                  Klicke auf <strong>„Wissenschaftlich erklärt“</strong>, um alle Studien & Quellen einzusehen.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareSection() {
  const rows = [
    { label: "Klassischer Wecker", price: "ab 10 €", pros: ["Günstig", "Einfach"], cons: ["Leicht zu ignorieren", "Kein Snooze-Schutz"], highlight: false },
    { label: "Smartphone-App", price: "0 – 5 €", pros: ["Flexibel", "Statistiken"], cons: ["Leicht ausschaltbar", "Ablenkung im Bett"], highlight: false },
    { label: "SmartRise One", price: "29,99 €", pros: ["Sensorbasiert", "Routinen-orientiert", "Schwer zu umgehen"], cons: [], highlight: true },
  ];
  return (
    <section id="vergleich" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-deep uppercase tracking-wider">Vergleich</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">
            Andere wecken dich. SmartRise One bringt dich raus.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`rounded-2xl p-7 border ${r.highlight ? "bg-deep text-primary-foreground border-deep shadow-[var(--shadow-glow)]" : "bg-card border-border"}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold">{r.label}</h3>
                <span className={`text-sm ${r.highlight ? "text-sunrise" : "text-muted-foreground"}`}>{r.price}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {r.pros.map((p) => (
                  <li key={p} className="flex gap-2"><CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${r.highlight ? "text-sunrise" : "text-emerald-600"}`} /> {p}</li>
                ))}
                {r.cons.map((c) => (
                  <li key={c} className="flex gap-2 opacity-70"><XCircle className="w-4 h-4 mt-0.5 shrink-0" /> {c}</li>
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
    { n: "01", title: "Basis-Wecker", desc: "Hardware-Prototyp mit LCD, Keypad, Lichtsensor und Aufsteh-Garantie.", status: "Heute" },
    { n: "02", title: "App-Integration & Gamification", desc: "Companion-App, Streaks, Belohnungssystem und personalisierte Weckprofile.", status: "2026" },
    { n: "03", title: "Smartwatch & Schlafanalyse", desc: "Vibration, Bewegungsdaten, REM-Erkennung für intelligentes Wecken.", status: "2026" },
    { n: "04", title: "Smarte Erweiterungen", desc: "Lichtwecker-Integration, KI-Routinen, Smart-Home-Anbindung.", status: "Vision" },
  ];
  return (
    <section id="roadmap" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-deep uppercase tracking-wider">Roadmap</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">Von Hardware zu Habit-OS.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {phases.map((p) => (
            <div key={p.n} className="bg-card border border-border rounded-2xl p-7">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-semibold text-sunrise">{p.n}</span>
                <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1">{p.status}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-deep">{p.title}</h3>
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
    <section id="team" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <span className="text-sm font-medium text-deep uppercase tracking-wider">Team & Kontakt</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">Drei Köpfe. Ein Morgen.</h2>
            <p className="mt-4 text-muted-foreground">
              Interdisziplinäres Team aus Daten, Software und Hardware.
            </p>
            <a href="mailto:smartrise.clocks@gmail.com" className="mt-8 inline-flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-full font-medium hover:bg-muted transition">
              <Mail className="w-4 h-4" /> smartrise.clocks@gmail.com
            </a>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            {team.map((m) => (
              <div key={m.name} className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full grid place-items-center font-display font-semibold text-lg text-sunrise-foreground" style={{ background: "var(--gradient-sunrise)" }}>
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
    <section id="preorder" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-medium text-deep uppercase tracking-wider">Preorder</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-deep">
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

        <div className="mt-14 grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-8 md:p-10 shadow-[var(--shadow-soft)]">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-14 h-14 rounded-full grid place-items-center" style={{ background: "var(--gradient-sunrise)" }}>
                  <CheckCircle2 className="w-7 h-7 text-sunrise-foreground" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-deep">
                  Vielen Dank für dein Interesse an SmartRise One.
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Wir melden uns, sobald es Neuigkeiten zum Produktstart gibt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-deep mb-2">
                    Vorname / Name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-deep/30 focus:border-deep transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-deep mb-2">
                    E-Mail-Adresse
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="max@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-deep/30 focus:border-deep transition"
                  />
                </div>
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-deep mb-2">
                    Wie bist du auf uns aufmerksam geworden?
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      required
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-deep/30 focus:border-deep transition"
                    >
                      <option value="" disabled>Bitte auswählen</option>
                      <option>Social Media</option>
                      <option>Empfehlung</option>
                      <option>Schule / Hochschule</option>
                      <option>Präsentation / Pitch</option>
                      <option>Google / Internet</option>
                      <option>Sonstiges</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-deep text-primary-foreground px-6 py-4 rounded-xl font-medium hover:opacity-90 transition shadow-[var(--shadow-soft)]"
                >
                  <Send className="w-4 h-4" /> Interesse absenden
                </button>

                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Keine Spam-Nachrichten. Nur relevante Updates zu SmartRise One.
                </p>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card border border-border rounded-3xl p-7 shadow-[var(--shadow-soft)]">
              <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: "var(--gradient-sunrise)" }}>
                <Mail className="w-5 h-5 text-sunrise-foreground" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-deep">Direkt Kontakt aufnehmen</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fragen zum Produkt oder zur Vorbestellung? Schreib uns direkt.
              </p>
              <a
                href="mailto:smartrise.clocks@gmail.com"
                className="mt-4 inline-flex items-center gap-2 text-deep font-medium hover:underline break-all"
              >
                smartrise.clocks@gmail.com
              </a>
            </div>

            <div className="bg-deep text-primary-foreground rounded-3xl p-7">
              <div className="flex items-center gap-2 text-sunrise text-sm font-medium">
                <Sparkles className="w-4 h-4" /> Was dich erwartet
              </div>
              <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-sunrise shrink-0" /> Frühzeitige Info zum Launch</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-sunrise shrink-0" /> Exklusiver Preorder-Zugang</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-sunrise shrink-0" /> Updates zu Features & Roadmap</li>
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
        <div className="relative overflow-hidden rounded-3xl bg-deep text-primary-foreground p-12 md:p-20 text-center">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-sunrise)" }} />
          <div className="relative">
            <Sun className="w-10 h-10 text-sunrise mx-auto" />
            <h2 className="mt-6 font-display text-4xl md:text-6xl font-semibold leading-tight">
              Gewinne den Morgen.<br />Beherrsche den Tag.
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/70 max-w-xl mx-auto">
              SmartRise One ist mehr als ein Wecker — es ist der Anfang einer neuen Routine.
            </p>
            <a href="#preorder" className="mt-10 inline-flex items-center gap-2 bg-sunrise text-sunrise-foreground px-7 py-4 rounded-full font-medium hover:opacity-90 transition shadow-[var(--shadow-glow)]">
              Preorder anfragen <ArrowRight className="w-4 h-4" />
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
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src={smartriseLogo} alt="SmartRise Logo" className="w-7 h-7 object-contain" />
          © {new Date().getFullYear()} SmartRise. Alle Rechte vorbehalten.
        </div>
        <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Pre-Launch · Hardware-Prototyp aktiv</div>
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
