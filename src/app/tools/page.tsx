import MarketingLayout from "@/components/site/MarketingLayout";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Tools — ARCH-AI" };

const TOOLS = [
  {
    id: "editor",
    icon: "✏️",
    name: "2D Floor-Plan Editor",
    status: "Available",
    body: "Draw walls on a snapping grid with live dimensions. Pan, zoom, erase and undo — a real drafting table in your browser.",
  },
  {
    id: "renderer",
    icon: "🏛️",
    name: "Live 3D Renderer",
    status: "Available",
    body: "Your plan extrudes into a shaded, walk-around model in real time, with lighting, shadows and orbit controls.",
  },
  {
    id: "ai",
    icon: "✨",
    name: "AI Layout Assistant",
    status: "Coming soon",
    body: "Describe a brief in plain language and generate a starting layout you can refine — the busywork, handled.",
  },
  {
    id: "exports",
    icon: "📦",
    name: "Exports — glTF & PDF",
    status: "Coming soon",
    body: "Hand off polished deliverables: export 3D models to glTF or generate clean PDF plan sheets for clients and contractors.",
  },
];

export default function ToolsPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="The toolkit"
        title="Everything you need to"
        accent="design and build."
        subtitle="One workspace, a growing set of tools. Here's what's live today and what's coming next."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <div
              key={t.id}
              id={t.id}
              className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-7 transition hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{t.icon}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    t.status === "Available"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold">{t.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
