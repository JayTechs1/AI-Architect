import Link from "next/link";
import MarketingLayout from "@/components/site/MarketingLayout";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "About — ARCH-AI" };

export default function AboutPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Our mission"
        title="Design tools that"
        accent="work for everyone."
        subtitle="ARCH-AI exists to put professional-grade design and 3D visualization in the hands of every architect, builder and client — not just the firms that can afford heavyweight desktop software."
      />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="space-y-6 text-lg leading-relaxed text-neutral-600">
          <p>
            We started ARCH-AI with a simple belief: turning an idea into a
            building shouldn&apos;t require a dozen disconnected tools. Drawing a
            plan, seeing it in 3D, sharing it with a client, and picking it back
            up on another device should all happen in one place.
          </p>
          <p>
            So we built a platform that lives in the cloud and runs anywhere —
            the office desktop, a laptop on site, or a tablet in a client
            meeting. Every project is saved, secure, and always up to date.
          </p>
          <p>
            We&apos;re just getting started. The roadmap runs from richer 3D and
            AI-assisted layouts to full team collaboration — and we&apos;re
            building it alongside the firms who use it every day.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            ["Built for teams", "Architects, builders and clients, together."],
            ["Cloud-native", "Your work, on every device, always saved."],
            ["Always evolving", "New tools shipping continuously."],
          ].map(([t, d]) => (
            <div
              key={t}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-base font-bold">{t}</h3>
              <p className="mt-2 text-sm text-neutral-500">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#demo"
            className="bg-brand-gradient inline-block rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-95"
          >
            Request a demo
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
