import Link from "next/link";
import MarketingLayout from "@/components/site/MarketingLayout";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Pricing — ARCH-AI" };

const TIERS = [
  {
    name: "Studio",
    price: "Contact us",
    blurb: "For independent architects and small practices getting started.",
    features: [
      "Up to 3 seats",
      "Unlimited projects",
      "2D editor + live 3D",
      "Cloud sync across devices",
      "Email support",
    ],
    cta: "Request a demo",
    highlight: false,
  },
  {
    name: "Firm",
    price: "Custom",
    blurb: "For growing firms that need the whole team in one workspace.",
    features: [
      "Everything in Studio",
      "Unlimited seats",
      "Team workspaces & sharing",
      "Priority support",
      "Onboarding & training",
    ],
    cta: "Request a demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    blurb: "For large organizations with custom deployment and API needs.",
    features: [
      "Everything in Firm",
      "API access & integrations",
      "Single sign-on (SSO)",
      "Dedicated environment",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Pricing"
        title="Plans that scale with"
        accent="your firm."
        subtitle="ARCH-AI is sold as a private deployment for your team. Request a demo and we'll tailor a plan to how you work."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                t.highlight
                  ? "border-cyan-400 shadow-xl shadow-cyan-500/15"
                  : "border-neutral-200"
              }`}
            >
              {t.highlight && (
                <span className="bg-brand-gradient absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold">{t.name}</h3>
              <p className="mt-3 text-3xl font-extrabold tracking-tight">
                {t.price}
              </p>
              <p className="mt-3 text-sm text-neutral-500">{t.blurb}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-neutral-600">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-cyan-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.name === "Enterprise" ? "/contact" : "/#demo"}
                className={`mt-8 rounded-lg px-4 py-3 text-center text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-brand-gradient text-white shadow-lg shadow-cyan-500/25 hover:opacity-95"
                    : "border border-neutral-300 text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-neutral-400">
          Prices shown are placeholders while we finalize plans. Talk to us for a
          quote tailored to your team.
        </p>
      </section>
    </MarketingLayout>
  );
}
