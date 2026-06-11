"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Wordmark = () => (
  <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
    <span className="bg-brand-gradient grid h-7 w-7 place-items-center rounded-lg text-sm text-white shadow-sm shadow-cyan-500/30">
      ◢
    </span>
    <span>
      ARCH<span className="text-cyan-500">-</span>AI
    </span>
  </span>
);

const TOOLS = [
  { label: "2D Floor-Plan Editor", href: "/tools#editor", soon: false },
  { label: "Live 3D Renderer", href: "/tools#renderer", soon: false },
  { label: "AI Layout Assistant", href: "/tools#ai", soon: true },
  { label: "Exports (glTF / PDF)", href: "/tools#exports", soon: true },
];

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "API", href: "/developers" },
  { label: "Contact", href: "/contact" },
];

export default function SiteNav({ authed }: { authed: boolean }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex-none">
          <Wordmark />
        </Link>

        {/* Desktop links */}
        <div className="ml-2 hidden items-center gap-1 md:flex">
          {LINKS.slice(0, 3).map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}

          {/* Tools dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setToolsOpen((o) => !o)}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              Tools
              <svg
                className={`h-3.5 w-3.5 transition ${toolsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5 6 7.5 9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-200/60">
                {TOOLS.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-neutral-700 transition hover:bg-cyan-50 hover:text-cyan-700"
                  >
                    {t.label}
                    {t.soon && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {LINKS.slice(3).map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right side CTAs */}
        <div className="ml-auto hidden items-center gap-1 md:flex">
          {authed ? (
            <Link
              href="/dashboard"
              className="bg-brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-cyan-500/20 transition hover:opacity-95"
            >
              Open studio →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
              >
                Client sign in
              </Link>
              <Link
                href="/#demo"
                className="bg-brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-cyan-500/20 transition hover:opacity-95"
              >
                Request a demo
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="ml-auto rounded-md p-2 text-neutral-600 md:hidden"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d={mobileOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/tools"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Tools
            </Link>
            <div className="mt-3 flex flex-col gap-2">
              {authed ? (
                <Link
                  href="/dashboard"
                  className="bg-brand-gradient rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Open studio →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700"
                  >
                    Client sign in
                  </Link>
                  <Link
                    href="/#demo"
                    className="bg-brand-gradient rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Request a demo
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
    >
      {children}
    </Link>
  );
}
