"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FloorPlan, Wall } from "@/lib/types";
import { DEFAULTS } from "@/lib/types";

type Tool = "draw" | "erase" | "pan";

type Props = {
  plan: FloorPlan;
  onChange: (plan: FloorPlan) => void;
};

const GRID_CM = 50; // one grid square = 50cm
const SNAP_CM = 25; // snap increments

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function FloorPlanEditor({ plan, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [tool, setTool] = useState<Tool>("draw");
  const [snap, setSnap] = useState(true);

  // View transform: world (cm) -> screen (px). scale = px per cm.
  const view = useRef({ scale: 0.4, offsetX: 0, offsetY: 0 });
  const [, force] = useState(0);
  const redraw = useCallback(() => force((n) => n + 1), []);

  // In-progress chain of wall points while drawing.
  const draftStart = useRef<{ x: number; y: number } | null>(null);
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const panning = useRef<{ x: number; y: number } | null>(null);

  // Center the view the first time we mount.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    view.current.offsetX = wrap.clientWidth / 2;
    view.current.offsetY = wrap.clientHeight / 2;
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toScreen = useCallback((x: number, y: number) => {
    const v = view.current;
    return { sx: x * v.scale + v.offsetX, sy: y * v.scale + v.offsetY };
  }, []);

  const toWorld = useCallback((sx: number, sy: number) => {
    const v = view.current;
    return { x: (sx - v.offsetX) / v.scale, y: (sy - v.offsetY) / v.scale };
  }, []);

  const snapWorld = useCallback(
    (x: number, y: number) => {
      // Snap to existing wall endpoints first, then to grid.
      const threshold = 18 / view.current.scale; // 18px in world units
      let best: { x: number; y: number } | null = null;
      let bestD = threshold;
      for (const w of plan.walls) {
        for (const p of [
          { x: w.x1, y: w.y1 },
          { x: w.x2, y: w.y2 },
        ]) {
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < bestD) {
            bestD = d;
            best = p;
          }
        }
      }
      if (best) return best;
      if (!snap) return { x, y };
      return {
        x: Math.round(x / SNAP_CM) * SNAP_CM,
        y: Math.round(y / SNAP_CM) * SNAP_CM,
      };
    },
    [plan.walls, snap],
  );

  // ---- Rendering -----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#0d0f17";
    ctx.fillRect(0, 0, w, h);

    const v = view.current;
    const gridPx = GRID_CM * v.scale;

    // Grid lines
    if (gridPx > 6) {
      const startX = v.offsetX % gridPx;
      const startY = v.offsetY % gridPx;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(240,168,48,0.06)";
      ctx.beginPath();
      for (let x = startX; x < w; x += gridPx) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = startY; y < h; y += gridPx) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    // Origin axes
    ctx.strokeStyle = "rgba(240,168,48,0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(v.offsetX, 0);
    ctx.lineTo(v.offsetX, h);
    ctx.moveTo(0, v.offsetY);
    ctx.lineTo(w, v.offsetY);
    ctx.stroke();

    // Walls
    for (const wall of plan.walls) {
      const a = toScreen(wall.x1, wall.y1);
      const b = toScreen(wall.x2, wall.y2);
      ctx.strokeStyle = "#e8eaf2";
      ctx.lineWidth = Math.max(3, wall.thickness * v.scale);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();

      // Endpoints
      ctx.fillStyle = "#f0a830";
      for (const p of [a, b]) {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Length label
      const lenCm = Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1);
      if (lenCm > 1) {
        ctx.fillStyle = "rgba(232,234,242,0.65)";
        ctx.font = "11px ui-monospace, monospace";
        ctx.textAlign = "center";
        const mx = (a.sx + b.sx) / 2;
        const my = (a.sy + b.sy) / 2;
        ctx.fillText(`${(lenCm / 100).toFixed(2)}m`, mx, my - 8);
      }
    }

    // Draft segment preview
    if (tool === "draw" && draftStart.current && cursor.current) {
      const a = toScreen(draftStart.current.x, draftStart.current.y);
      const b = toScreen(cursor.current.x, cursor.current.y);
      ctx.strokeStyle = "rgba(240,168,48,0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
      ctx.setLineDash([]);

      const lenCm = Math.hypot(
        cursor.current.x - draftStart.current.x,
        cursor.current.y - draftStart.current.y,
      );
      ctx.fillStyle = "#f0a830";
      ctx.font = "12px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${(lenCm / 100).toFixed(2)} m`, b.sx + 10, b.sy - 10);
    }

    // Snap cursor dot
    if (cursor.current && tool === "draw") {
      const c = toScreen(cursor.current.x, cursor.current.y);
      ctx.strokeStyle = "#f0a830";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(c.sx, c.sy, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // Keep canvas sized to its container.
  useEffect(() => {
    const ro = new ResizeObserver(() => redraw());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [redraw]);

  // ---- Interaction ---------------------------------------------------------
  const getLocal = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { sx: e.clientX - rect.left, sy: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    const { sx, sy } = getLocal(e);

    if (tool === "pan" || e.button === 1) {
      panning.current = { x: sx, y: sy };
      return;
    }

    const world = toWorld(sx, sy);

    if (tool === "draw") {
      const p = snapWorld(world.x, world.y);
      if (!draftStart.current) {
        draftStart.current = p;
      } else {
        const start = draftStart.current;
        if (Math.hypot(p.x - start.x, p.y - start.y) > 1) {
          const wall: Wall = {
            id: uid(),
            x1: start.x,
            y1: start.y,
            x2: p.x,
            y2: p.y,
            height: DEFAULTS.wallHeight,
            thickness: DEFAULTS.wallThickness,
          };
          onChange({ ...plan, walls: [...plan.walls, wall] });
        }
        draftStart.current = p; // chain from the new endpoint
      }
      cursor.current = p;
      redraw();
    } else if (tool === "erase") {
      const hit = hitTestWall(world.x, world.y);
      if (hit) {
        onChange({ ...plan, walls: plan.walls.filter((w) => w.id !== hit) });
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { sx, sy } = getLocal(e);

    if (panning.current) {
      const dx = sx - panning.current.x;
      const dy = sy - panning.current.y;
      view.current.offsetX += dx;
      view.current.offsetY += dy;
      panning.current = { x: sx, y: sy };
      redraw();
      return;
    }

    if (tool === "draw") {
      const world = toWorld(sx, sy);
      cursor.current = snapWorld(world.x, world.y);
      redraw();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    canvasRef.current?.releasePointerCapture(e.pointerId);
    panning.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { sx, sy } = {
      sx: e.clientX - canvasRef.current!.getBoundingClientRect().left,
      sy: e.clientY - canvasRef.current!.getBoundingClientRect().top,
    };
    const before = toWorld(sx, sy);
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    view.current.scale = Math.min(4, Math.max(0.05, view.current.scale * factor));
    const after = toWorld(sx, sy);
    // Keep the point under the cursor fixed while zooming.
    view.current.offsetX += (after.x - before.x) * view.current.scale;
    view.current.offsetY += (after.y - before.y) * view.current.scale;
    redraw();
  };

  const hitTestWall = (x: number, y: number): string | null => {
    const threshold = 14 / view.current.scale;
    for (const w of plan.walls) {
      const d = distToSegment(x, y, w.x1, w.y1, w.x2, w.y2);
      if (d < threshold) return w.id;
    }
    return null;
  };

  // Finish / cancel the current chain with Escape; undo last wall with Cmd/Ctrl+Z.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        draftStart.current = null;
        cursor.current = null;
        redraw();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (plan.walls.length) {
          onChange({ ...plan, walls: plan.walls.slice(0, -1) });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plan, onChange, redraw]);

  const clearAll = () => {
    draftStart.current = null;
    onChange({ ...plan, walls: [] });
  };

  const zoom = (factor: number) => {
    view.current.scale = Math.min(4, Math.max(0.05, view.current.scale * factor));
    redraw();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <ToolButton active={tool === "draw"} onClick={() => setTool("draw")}>
          ✏️ Draw walls
        </ToolButton>
        <ToolButton active={tool === "erase"} onClick={() => setTool("erase")}>
          🧽 Erase
        </ToolButton>
        <ToolButton active={tool === "pan"} onClick={() => setTool("pan")}>
          ✋ Pan
        </ToolButton>
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          onClick={() => setSnap((s) => !s)}
          className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
            snap
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-foreground"
          }`}
        >
          ⊞ Snap {snap ? "on" : "off"}
        </button>
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          onClick={() => zoom(1.2)}
          className="rounded-md px-2 py-1.5 text-sm text-muted hover:text-foreground"
        >
          ＋
        </button>
        <button
          onClick={() => zoom(1 / 1.2)}
          className="rounded-md px-2 py-1.5 text-sm text-muted hover:text-foreground"
        >
          －
        </button>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-xs text-muted sm:inline">
            Click to place points · Esc to finish · ⌘Z to undo
          </span>
          <button
            onClick={clearAll}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-300/80 hover:bg-red-500/10 hover:text-red-300"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
          onContextMenu={(e) => {
            e.preventDefault();
            draftStart.current = null;
            redraw();
          }}
          className={`h-full w-full touch-none ${
            tool === "pan" ? "cursor-grab" : "cursor-crosshair"
          }`}
        />
      </div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-accent text-black"
          : "text-muted hover:bg-surface-2 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}
