import type { Metadata } from "next";
import {
  Sora,
  Inter,
  JetBrains_Mono,
  Playfair_Display,
  Instrument_Serif,
  Barlow,
} from "next/font/google";
import "./globals.css";

// Sora — modern geometric display face for big, confident headlines.
const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

// Inter — clean, highly legible body / UI text.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Playfair Display (italic) — serif accent for the spotlight hero wordmark
// and headline, per the hero spec.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
});

// Instrument Serif (italic) + Barlow — the liquid-glass landing sections'
// heading/body pairing.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ARCH-AI — Design, render & build",
  description:
    "The private design platform for architects and builders. Draft floor plans, render live 3D models, and access every project from any device. Request a demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} ${playfair.variable} ${instrument.variable} ${barlow.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
