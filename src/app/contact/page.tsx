import MarketingLayout from "@/components/site/MarketingLayout";
import PageHero from "@/components/site/PageHero";
import DemoRequestForm from "@/components/DemoRequestForm";

export const metadata = { title: "Contact — ARCH-AI" };

export default function ContactPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Get in touch"
        title="Let's talk about"
        accent="your projects."
        subtitle="Questions, demos, partnerships or API access — tell us what you need and the team will get back to you."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Reach us directly</h2>
            <div className="mt-6 space-y-5">
              <ContactRow
                label="Email"
                value="hello@arch-ai.app"
                href="mailto:hello@arch-ai.app"
              />
              <ContactRow
                label="Sales & demos"
                value="sales@arch-ai.app"
                href="mailto:sales@arch-ai.app"
              />
              <ContactRow
                label="Support"
                value="support@arch-ai.app"
                href="mailto:support@arch-ai.app"
              />
            </div>
            <p className="mt-8 text-sm text-neutral-500">
              Prefer a form? Fill out the details and we&apos;ll route your
              message to the right team.
            </p>
          </div>

          <DemoRequestForm />
        </div>
      </section>
    </MarketingLayout>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <a
        href={href}
        className="mt-1 block text-base font-medium text-cyan-700 hover:underline"
      >
        {value}
      </a>
    </div>
  );
}
