"use client";

import dynamic from "next/dynamic";
import { SAMPLE_PLAN } from "@/lib/samplePlan";

const Scene3D = dynamic(() => import("./editor/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      Loading 3D preview…
    </div>
  ),
});

export default function HeroDemo() {
  return (
    <div className="h-full w-full">
      <Scene3D plan={SAMPLE_PLAN} light />
    </div>
  );
}
