export default function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-20 -top-24 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-cyan-700 shadow-sm backdrop-blur">
            <span className="live-dot h-2 w-2 rounded-full bg-teal-500" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          {title} {accent && <span className="text-cyan-600">{accent}</span>}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-xl text-neutral-500">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
