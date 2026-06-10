import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { EMPTY_PLAN } from "@/lib/types";

// GET /api/projects — list the current user's projects
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: session.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ projects });
}

// POST /api/projects — create a new project
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = (body.name ? String(body.name) : "Untitled Project").trim();

  const project = await prisma.project.create({
    data: {
      name: name || "Untitled Project",
      description: body.description ? String(body.description).trim() : null,
      data: JSON.stringify(EMPTY_PLAN),
      ownerId: session.userId,
    },
  });

  return NextResponse.json({ project });
}
