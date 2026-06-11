import Link from "next/link";
import HeroDemo from "@/components/HeroDemo";
import DemoRequestForm from "@/components/DemoRequestForm";
import MarketingLayout from "@/components/site/MarketingLayout";

export default function Home() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated gradient glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute right-0 top-10 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-10 left-1/3 h-80 w-80 rounded-full bg-teal-300/40 blur-3xl" />
        </div>
        {/* Faint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage:
              "linear-gradient(#e6f4f8 1px, transparent 1px), linear-gradient(90deg, #e6f4f8 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16">
          {/* Text card — spread across the top, centered */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/70 bg-white/70 px-6 py-12 text-center shadow-xl shadow-cyan-500/5 backdrop-blur sm:px-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-cyan-700 shadow-sm backdrop-blur">
              <span className="live-dot h-2 w-2 rounded-full bg-teal-500" />
              Live design studio for architects &amp; builders
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              From floor plan to{" "}
              <span className="text-cyan-600">living 3D</span>, in one workspace.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-neutral-500">
              ARCH-AI is the private design platform we deploy for your firm.
              Draft plans, render walk-through models, and access every project
              securely from any device.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#demo"
                className="bg-brand-gradient rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-95"
              >
                Request a demo
              </a>
              <Link
                href="/login"
                className="rounded-lg border border-neutral-300 bg-white px-7 py-3.5 text-base font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Client sign in
              </Link>
            </div>
            <p className="mt-4 text-sm text-neutral-400">
              Access is by invitation — request a demo and we&apos;ll set up
              your team.
            </p>
          </div>

          {/* Live 3D preview — centered, below the text */}
          <div className="relative mx-auto mt-12 max-w-4xl">
            <div className="bg-brand-gradient absolute -inset-1 rounded-3xl opacity-20 blur-xl" />
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/60 bg-neutral-50 shadow-2xl shadow-cyan-500/10 ring-1 ring-black/5">
              <HeroDemo />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-teal-500" />
                Rendering · live model
              </div>
              <div className="absolute bottom-4 right-4 rounded-full border border-neutral-200 bg-white/85 px-3 py-1.5 text-xs font-medium text-neutral-500 shadow-sm backdrop-blur">
                Drag to orbit ↻
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning strip */}
      <section className="relative border-y border-neutral-200 bg-gradient-to-b from-white to-cyan-50/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:grid-cols-3">
          {[
            ["Any device", "Cloud projects that follow your team everywhere"],
            ["Built for firms", "Seats for everyone — not a single-user tool"],
            ["Private by default", "Your work stays yours, behind your login"],
          ].map(([t, d]) => (
            <div key={t} className="text-center sm:text-left">
              <p className="text-sm font-semibold text-neutral-900">{t}</p>
              <p className="mt-1 text-sm text-neutral-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Not another <span className="text-cyan-600">floor-plan app.</span>
          </h2>
          <p className="mt-5 text-xl text-neutral-500">
            Most tools force you to pick: easy or powerful, 2D or 3D, solo or
            team. ARCH-AI is built to accommodate everyone, on every project.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              k: "01",
              t: "Draw once, see it in 3D",
              d: "Sketch a plan on a snapping grid and watch it rise into a shaded, walk-around model in the same window — no exporting, no waiting.",
            },
            {
              k: "02",
              t: "Your whole team, one platform",
              d: "Architects, builders, and clients work from the same source of truth. No more emailing versions back and forth.",
            },
            {
              k: "03",
              t: "Access from anywhere",
              d: "Projects live in the cloud and sync across devices. Pick up on the office desktop exactly where the site laptop left off.",
            },
            {
              k: "04",
              t: "Private & secure",
              d: "Deployed for your firm behind your own logins. Your designs are never exposed to the public web.",
            },
            {
              k: "05",
              t: "Made to scale with you",
              d: "From a single extension to a full development — the same fast workspace handles a sketch or a skyline.",
            },
            {
              k: "06",
              t: "AI-assisted, on the roadmap",
              d: "Generate starting layouts from a brief and let the platform handle the busywork, so you focus on design.",
            },
          ].map((f) => (
            <div
              key={f.k}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <span className="font-mono text-sm font-semibold text-cyan-600">
                {f.k}
              </span>
              <h3 className="mt-3 text-lg font-bold">{f.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo request */}
      <section
        id="demo"
        className="scroll-mt-20 border-t border-neutral-200 bg-gradient-to-br from-cyan-50/60 via-white to-sky-50/60"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              See ARCH-AI <span className="text-cyan-600">on your projects.</span>
            </h2>
            <p className="mt-5 text-xl text-neutral-500">
              Tell us a little about your firm and we&apos;ll set up a private
              walkthrough. Approved teams get an email invite to sign in — with
              Google or your work email — and start designing right away.
            </p>
            <ul className="mt-8 space-y-3 text-base text-neutral-600">
              {[
                "A guided demo tailored to how your team works",
                "Your own secure workspace in the cloud",
                "Onboarding for architects, builders and clients",
              ].map((li) => (
                <li key={li} className="flex items-start gap-3">
                  <span className="bg-brand-gradient mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full text-[11px] text-white">
                    ✓
                  </span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <DemoRequestForm />
        </div>
      </section>
    </MarketingLayout>
  );
}
