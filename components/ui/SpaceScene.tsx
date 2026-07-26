"use client";

import { useEffect, useState } from "react";
import VideoLoop from "./VideoLoop";

/**
 * DARK MODE backdrop — looping cosmic footage (darkmode.mp4).
 *
 * The clip averages ~0.5 luminance with near-white peaks (~0.94) on the left,
 * where the hero copy lives, so white text needs a real scrim. Measured: at
 * 0.80 left alpha those peaks left white text at only 4.6:1 and muted text at
 * 3.4:1 (failing AA), so the wash runs ≈0.88 on the left — peaks land near
 * 0.12 luminance, giving ~5.9:1 white / ~4.2:1 muted — easing to 0.42 on the
 * right so the footage still reads.
 *
 * Mobile / reduced-motion / no-autoplay get a static nebula gradient instead —
 * no multi-MB video download on a phone.
 */
const NEBULA_CSS =
  "radial-gradient(120% 90% at 78% 12%, rgba(124,58,237,0.28), transparent 52%)," +
  "radial-gradient(90% 80% at 12% 88%, rgba(236,72,153,0.18), transparent 55%)," +
  "radial-gradient(80% 70% at 85% 80%, rgba(59,130,246,0.16), transparent 55%)," +
  "#05060A";

export default function SpaceScene() {
  const [mode, setMode] = useState<"pending" | "video" | "lite">("pending");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 820px)").matches;
    setMode(reduce || small ? "lite" : "video");
  }, []);

  if (mode !== "video") {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: NEBULA_CSS }}
      />
    );
  }

  return (
    <VideoLoop src="/darkmode.mp4" fallback={NEBULA_CSS}>
      {/* horizontal legibility scrim — heaviest under the text column */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,5,14,0.88) 0%, rgba(3,5,14,0.84) 34%, rgba(3,5,14,0.60) 62%, rgba(3,5,14,0.42) 100%)",
        }}
      />
      {/* vertical settle so the navbar and footer edges stay calm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,4,12,0.45) 0%, rgba(2,4,12,0.10) 40%, rgba(2,4,12,0.50) 100%)",
        }}
      />
    </VideoLoop>
  );
}
