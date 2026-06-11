import Link from "next/link";
import MarketingLayout from "@/components/site/MarketingLayout";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "API & Developers — ARCH-AI" };

export default function DevelopersPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Developers"
        title="Build on the"
        accent="ARCH-AI API."
        subtitle="Bring floor-plan and 3D rendering into your own products. Generate an API key and integrate ARCH-AI wherever you need it."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">A simple, modern API</h2>
            <p className="mt-3 text-neutral-500">
              Create projects, push plan data, and request renders
              programmatically. Authenticate with a private API key scoped to
              your account.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-600">
              {[
                "REST endpoints for projects and plans",
                "Server-side render requests",
                "Scoped, revocable API keys",
                "Webhooks for render completion (coming soon)",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-cyan-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="bg-brand-gradient mt-8 inline-block rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-95"
            >
              Request API access
            </Link>
          </div>

          {/* Code sample */}
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-xl">
            <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-xs text-neutral-500">
                create-render.sh
              </span>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
              <code className="font-mono text-neutral-300">
                <span className="text-neutral-500"># Render a project to a 3D model</span>
                {"\n"}
                <span className="text-cyan-400">curl</span> https://api.arch-ai.app/v1/renders {"\\"}
                {"\n  "}-H <span className="text-teal-300">&quot;Authorization: Bearer $ARCH_AI_KEY&quot;</span> {"\\"}
                {"\n  "}-H <span className="text-teal-300">&quot;Content-Type: application/json&quot;</span> {"\\"}
                {"\n  "}-d <span className="text-teal-300">&apos;&#123;&quot;projectId&quot;: &quot;prj_123&quot;&#125;&apos;</span>
              </code>
            </pre>
          </div>
        </div>

        <p className="mt-12 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
          The public API is in private preview. Request access and we&apos;ll
          onboard you with keys and docs.
        </p>
      </section>
    </MarketingLayout>
  );
}
