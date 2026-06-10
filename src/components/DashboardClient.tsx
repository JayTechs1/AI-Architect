"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectSummary } from "@/lib/types";

export default function DashboardClient({
  initialProjects,
  userName,
}: {
  initialProjects: ProjectSummary[];
  userName: string;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [creating, setCreating] = useState(false);

  async function createProject() {
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Project" }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/projects/${data.project.id}`);
    } finally {
      setCreating(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((p) => p.filter((x) => x.id !== id));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="text-accent">◢</span> AI Architect
          </span>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">
              {userName}
            </span>
            <button
              onClick={logout}
              className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Your projects</h1>
            <p className="mt-1 text-sm text-muted">
              {projects.length
                ? `${projects.length} project${projects.length === 1 ? "" : "s"}`
                : "No projects yet — start your first design."}
            </p>
          </div>
          <button
            onClick={createProject}
            disabled={creating}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-accent-soft disabled:opacity-60"
          >
            {creating ? "Creating…" : "+ New project"}
          </button>
        </div>

        {projects.length === 0 ? (
          <button
            onClick={createProject}
            className="blueprint-grid mt-10 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-muted transition hover:border-accent/40 hover:text-foreground"
          >
            <span className="text-4xl">＋</span>
            <span className="text-sm font-medium">Create your first project</span>
          </button>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/projects/${p.id}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/40"
              >
                <div className="blueprint-grid flex h-32 items-center justify-center bg-surface-2 text-3xl text-accent/40 transition group-hover:text-accent/70">
                  ◳
                </div>
                <div className="flex items-start justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{p.name}</h3>
                    <p className="mt-0.5 text-xs text-muted">
                      Updated {new Date(p.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(p.id);
                    }}
                    className="rounded-md px-2 py-1 text-xs text-muted opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
