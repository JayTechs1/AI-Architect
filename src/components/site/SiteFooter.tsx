import Link from "next/link";

const GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Pricing", href: "/pricing" },
      { label: "API", href: "/developers" },
      { label: "Request a demo", href: "/#demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Client sign in", href: "/login" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="bg-brand-gradient grid h-7 w-7 place-items-center rounded-lg text-sm text-white">
              ◢
            </span>
            ARCH<span className="text-cyan-500">-</span>AI
          </span>
          <p className="mt-4 max-w-xs text-sm text-neutral-500">
            The private design platform for architects and builders. Draft,
            render and build — from any device.
          </p>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm font-semibold text-neutral-900">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-500 transition hover:text-cyan-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} ARCH-AI. Design, render &amp; build.
        </div>
      </div>
    </footer>
  );
}
