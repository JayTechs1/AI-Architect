"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SAMPLE_PLAN } from "@/lib/samplePlan";
import PlanFallback from "./PlanFallback";

const Scene3D = dynamic(() => import("./editor/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50 text-sm text-cyan-700">
      Loading 3D preview…
    </div>
  ),
});

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function HeroDemo() {
  // null = checking, true/false = result. Avoids a hydration flash.
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(webglSupported());
  }, []);

  if (webgl === null) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-sky-50 to-cyan-50" />
    );
  }

  if (!webgl) {
    return <PlanFallback />;
  }

  return (
    <div className="h-full w-full">
      <Scene3D plan={SAMPLE_PLAN} light autoRotate />
    </div>
  );
}
