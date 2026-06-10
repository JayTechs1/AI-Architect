import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/:id — fetch a single project (owner only)
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.ownerId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

// PUT /api/projects/:id — update name/description/plan data (owner only)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, string> = {};
  if (typeof body.name === "string") data.name = body.name.trim() || existing.name;
  if (typeof body.description === "string") data.description = body.description.trim();
  if (body.data !== undefined) {
    // Accept either a JSON string or an object; always store as a string.
    data.data =
      typeof body.data === "string" ? body.data : JSON.stringify(body.data);
  }

  const project = await prisma.project.update({ where: { id }, data });
  return NextResponse.json({ project });
}

// DELETE /api/projects/:id — delete a project (owner only)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
