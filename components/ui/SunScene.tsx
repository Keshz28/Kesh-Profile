"use client";

import { useEffect, useState } from "react";
import VideoLoop from "./VideoLoop";

/**
 * LIGHT MODE backdrop — looping footage (lightmode.mp4).
 *
 * The clip averages ~0.46 luminance, which is far too dark for light mode's
 * deep-bronze text. The cream wash below is weighted to the left (≈0.66 alpha,
 * lifting a 0.42 mid-tone to ≈0.78 — comfortably readable) and eases off to the
 * right so the footage stays visible.
 *
 * Mobile / reduced-motion get a static corona gradient — no video download.
 */
const CORONA_CSS =
  "radial-gradient(120% 95% at 78% 12%, rgba(255,214,140,0.75), transparent 55%)," +
  "radial-gradient(90% 80% at 15% 85%, rgba(255,190,150,0.35), transparent 58%)," +
  "radial-gradient(70% 60% at 82% 18%, rgba(255,255,245,0.85), transparent 45%)," +
  "#FFF6E8";

export default function SunScene() {
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
        style={{ background: CORONA_CSS }}
      />
    );
  }

  return (
    <VideoLoop src="/lightmode.mp4" fallback={CORONA_CSS}>
      {/* Light cream scrim, weighted to the text column and clearing fast so
          the right two-thirds of the footage stays vivid. Legibility is
          carried mostly by the per-glyph halo in globals.css rather than by
          washing the whole frame out. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,247,235,0.38) 0%, rgba(255,246,232,0.32) 30%, rgba(255,244,226,0.12) 55%, rgba(255,242,222,0.04) 100%)",
        }}
      />
      {/* faint vertical settle so the navbar and footer edges stay readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,248,236,0.30) 0%, rgba(255,248,236,0.04) 38%, rgba(255,246,230,0.28) 100%)",
        }}
      />
    </VideoLoop>
  );
}
