import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";
import type { ProjectSummary } from "@/lib/types";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await prisma.project.findMany({
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

  const projects: ProjectSummary[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <DashboardClient
      initialProjects={projects}
      userName={session.name || session.email}
    />
  );
}
