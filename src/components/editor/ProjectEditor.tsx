"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import FloorPlanEditor from "./FloorPlanEditor";
import type { FloorPlan } from "@/lib/types";

// Three.js touches the DOM/WebGL, so load the 3D scene client-side only.
const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      Loading 3D engine…
    </div>
  ),
});

type SaveState = "saved" | "saving" | "dirty" | "error";

type Props = {
  projectId: string;
  initialName: string;
  initialPlan: FloorPlan;
};

type View = "split" | "plan" | "model";

export default function ProjectEditor({
  projectId,
  initialName,
  initialPlan,
}: Props) {
  const [plan, setPlan] = useState<FloorPlan>(initialPlan);
  const [name, setName] = useState(initialName);
  const [view, setView] = useState<View>("split");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    async (nextPlan: FloorPlan, nextName: string) => {
      setSaveState("saving");
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nextName, data: nextPlan }),
        });
        setSaveState(res.ok ? "saved" : "error");
      } catch {
        setSaveState("error");
      }
    },
    [projectId],
  );

  // Debounced autosave whenever the plan or name changes.
  const scheduleSave = useCallback(
    (nextPlan: FloorPlan, nextName: string) => {
      setSaveState("dirty");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => persist(nextPlan, nextName), 800);
    },
    [persist],
  );

  const onPlanChange = useCallback(
    (next: FloorPlan) => {
      setPlan(next);
      scheduleSave(next, name);
    },
    [name, scheduleSave],
  );

  const onNameChange = (next: string) => {
    setName(next);
    scheduleSave(plan, next);
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const wallCount = plan.walls.length;
  const totalLength =
    plan.walls.reduce(
      (sum, w) => sum + Math.hypot(w.x2 - w.x1, w.y2 - w.y1),
      0,
    ) / 100;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
        <Link
          href="/dashboard"
          className="text-muted transition hover:text-foreground"
          title="Back to dashboard"
        >
          ←
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-accent">◢</span>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-56 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-foreground outline-none focus:bg-surface-2"
          />
        </div>

        <SaveBadge state={saveState} />

        {/* View switcher */}
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-surface-2 p-1 text-xs">
          {(["plan", "split", "model"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${
                view === v
                  ? "bg-accent text-black"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {v === "plan" ? "2D Plan" : v === "model" ? "3D Model" : "Split"}
            </button>
          ))}
        </div>
      </header>

      {/* Workspace */}
      <div className="flex min-h-0 flex-1">
        {(view === "plan" || view === "split") && (
          <div
            className={`min-w-0 ${view === "split" ? "w-1/2 border-r border-border" : "w-full"}`}
          >
            <FloorPlanEditor plan={plan} onChange={onPlanChange} />
          </div>
        )}
        {(view === "model" || view === "split") && (
          <div className={`min-w-0 ${view === "split" ? "w-1/2" : "w-full"}`}>
            <Scene3D plan={plan} />
          </div>
        )}
      </div>

      {/* Status bar */}
      <footer className="flex items-center gap-4 border-t border-border bg-surface px-4 py-1.5 text-xs text-muted">
        <span>{wallCount} walls</span>
        <span>{totalLength.toFixed(1)} m total</span>
        <span className="ml-auto font-mono opacity-60">AI Architect</span>
      </footer>
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  const map = {
    saved: { label: "Saved", color: "text-emerald-400", dot: "bg-emerald-400" },
    saving: { label: "Saving…", color: "text-accent", dot: "bg-accent" },
    dirty: { label: "Unsaved", color: "text-muted", dot: "bg-muted" },
    error: { label: "Save failed", color: "text-red-400", dot: "bg-red-400" },
  }[state];
  return (
    <span className={`flex items-center gap-1.5 text-xs ${map.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${map.dot}`} />
      {map.label}
    </span>
  );
}
