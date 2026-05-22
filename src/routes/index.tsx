import { createFileRoute } from "@tanstack/react-router";
import SmartRiseLanding from "@/components/SmartRiseLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartRise One — Smarter Wecker mit Aufsteh-Garantie" },
      { name: "description", content: "SmartRise One ist der smarte Wecker mit Aufsteh-Garantie. Wissenschaftlich fundiert für einen produktiven Morgen." },
      { property: "og:title", content: "SmartRise One — Smarter Wecker mit Aufsteh-Garantie" },
      { property: "og:description", content: "Der smarte Wecker mit Aufsteh-Garantie für einen produktiven Morgen." },
    ],
  }),
  component: SmartRiseLanding,
});
