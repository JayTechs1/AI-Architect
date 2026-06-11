"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

// Hero imagery (self-hosted in /public): the same building as a framing
// blueprint (base) and the finished photoreal build (revealed in the
// cursor spotlight).
const BG_IMAGE_1 = "/hero-frame.png";
const BG_IMAGE_2 = "/hero-built.png";

const SPOTLIGHT_R = 260;

function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string;
  cursorX: number;
  cursorY: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Keep the mask canvas sized to the viewport.
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Repaint the soft circular mask at the (smoothed) cursor on every render.
  useEffect(() => {
    const c = canvasRef.current;
    const div = revealRef.current;
    if (!c || !div) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, c.width, c.height);
    const g = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,0.75)");
    g.addColorStop(0.75, "rgba(255,255,255,0.4)");
    g.addColorStop(0.88, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const url = c.toDataURL();
    div.style.maskImage = `url(${url})`;
    div.style.webkitMaskImage = `url(${url})`;
    div.style.maskSize = "100% 100%";
    div.style.webkitMaskSize = "100% 100%";
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export default function SpotlightHero() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Fixed nav over the hero */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic">
            ARCH-AI
          </span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <Link
            href="/"
            className="bg-transparent text-white px-4 py-1.5 rounded-full text-sm font-medium"
          >
            Home
          </Link>
          {[
            ["Tools", "/tools"],
            ["Pricing", "/pricing"],
            ["About", "/about"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100"
        >
          Client Sign In
        </Link>

        <button className="md:hidden text-white p-1" aria-label="Menu">
          <Menu size={26} />
        </button>
      </nav>

      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: "100dvh" }}
      >
        {/* Base image */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Cursor spotlight reveal */}
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* Heading */}
        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
            >
              Every plan holds
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
            >
              a finished build
            </span>
          </h1>
        </div>

        {/* Bottom-left paragraph */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Every project starts as a drawing. ARCH-AI turns plans into
            photoreal, walk-through models your whole team can explore — long
            before ground breaks.
          </p>
        </div>

        {/* Bottom-right block */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: "0.85s" }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Move your light across the page to see the frame become the finished
            home. Design, render and share every project from one secure
            workspace — on any device.
          </p>
          <Link
            href="/contact"
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
          >
            Request a Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
