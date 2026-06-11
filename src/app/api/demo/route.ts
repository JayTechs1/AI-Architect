import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/demo — capture a demo request from the marketing site.
// Public (no auth): this is the top of the sales funnel.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const company = body.company ? String(body.company).trim() : null;
    const role = body.role ? String(body.role).trim() : null;
    const message = body.message ? String(body.message).trim() : null;

    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid work email." },
        { status: 400 },
      );
    }

    await prisma.demoRequest.create({
      data: { name, email, company, role, message },
    });

    // NOTE: transactional email (confirmation + sales notification) is wired
    // here once an email provider is configured. For now the lead is stored
    // and an admin follows up from the dashboard.

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("demo request error", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
