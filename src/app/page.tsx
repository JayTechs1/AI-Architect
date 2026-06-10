import Link from "next/link";
import { getSession } from "@/lib/auth";
import HeroDemo from "@/components/HeroDemo";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="text-accent">◢</span> AI Architect
          </span>
          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-soft"
              >
                Open studio →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-soft"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="blueprint-grid relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              For architects &amp; builders
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Draft floor plans.
              <br />
              Watch them rise in <span className="text-accent">3D.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted">
              A studio for designing buildings on the web. Sketch a plan and
              explore it as a live 3D model in the same window — then save every
              project to your account.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={session ? "/dashboard" : "/signup"}
                className="glow-accent rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:bg-accent-soft"
              >
                {session ? "Open your studio" : "Start designing — free"}
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Live 3D preview */}
          <div className="h-[380px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:h-[440px]">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-3">
          {[
            {
              icon: "✏️",
              title: "Plan in 2D",
              body: "Draw walls on a snapping grid with live dimensions. Pan, zoom and refine like a real drafting table.",
            },
            {
              icon: "🏛️",
              title: "Render in 3D",
              body: "Your plan extrudes into a shaded, walk-around model instantly — lighting, shadows and orbit controls included.",
            },
            {
              icon: "💾",
              title: "Save & revisit",
              body: "Every project lives in your account with autosave, so you can pick up exactly where you left off.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Your next building starts here.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Create a free account and design your first project in minutes.
          </p>
          <Link
            href={session ? "/dashboard" : "/signup"}
            className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:bg-accent-soft"
          >
            {session ? "Go to dashboard" : "Get started"}
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
          <span className="flex items-center gap-2">
            <span className="text-accent">◢</span> AI Architect
          </span>
        </div>
      </footer>
    </div>
  );
}
