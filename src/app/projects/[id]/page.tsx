import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parsePlan } from "@/lib/types";
import ProjectEditor from "@/components/editor/ProjectEditor";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.ownerId !== session.userId) notFound();

  return (
    <ProjectEditor
      projectId={project.id}
      initialName={project.name}
      initialPlan={parsePlan(project.data)}
    />
  );
}
