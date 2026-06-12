"use client";

import { useEffect, useRef } from "react";

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55; // seconds before the end to start fading out

// Looping background video with a JS-driven crossfade: fade in on load,
// fade out just before the clip ends, rewind, fade back in. The `loop`
// attribute is intentionally OFF — looping is implemented via `ended` so
// the fade can run. All fades are requestAnimationFrame-driven (no CSS
// transitions), and each new fade resumes from the current opacity.
export default function FadingVideo({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeTo = (target: number, duration = FADE_MS) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const from = parseFloat(video.style.opacity || "0");
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        video.style.opacity = String(from + (target - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onLoadedData = () => {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(1);
    };

    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (
        !fadingOutRef.current &&
        Number.isFinite(remaining) &&
        remaining <= FADE_OUT_LEAD &&
        remaining > 0
      ) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
    />
  );
}
