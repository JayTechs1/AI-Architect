import { SAMPLE_PLAN } from "@/lib/samplePlan";

// A clean 2D blueprint render of the sample plan, shown when WebGL is
// unavailable so the hero never looks broken. Pure SVG — no GPU needed.
export default function PlanFallback() {
  const pts = SAMPLE_PLAN.walls.flatMap((w) => [
    [w.x1, w.y1],
    [w.x2, w.y2],
  ]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const pad = 80;

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8">
      <svg
        viewBox={`${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`}
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        {/* room fills */}
        {SAMPLE_PLAN.rooms.map((r) => (
          <polygon
            key={r.id}
            points={r.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="#06b6d4"
            fillOpacity={0.06}
          />
        ))}
        {/* walls */}
        {SAMPLE_PLAN.walls.map((wall) => (
          <line
            key={wall.id}
            x1={wall.x1}
            y1={wall.y1}
            x2={wall.x2}
            y2={wall.y2}
            stroke="url(#wall)"
            strokeWidth={16}
            strokeLinecap="round"
          />
        ))}
        {/* endpoints */}
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={9} fill="#0891b2" />
        ))}
      </svg>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-center text-[11px] font-medium text-cyan-700 shadow-sm backdrop-blur">
        Plan preview · enable hardware acceleration for live 3D
      </div>
    </div>
  );
}
