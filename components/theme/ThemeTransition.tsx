"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { applyTheme, FLIP_EVENT, type Theme } from "./useTheme";

/**
 * Theme swap driven by transition.mp4 — a bright blue-white diagonal light
 * sweep. The clip is ~21–30% near-black, so it composites with `screen` blend:
 * darks drop out, the beam adds light over the page.
 *
 * Because the sweep never fully covers the frame, a theme-coloured scrim rises
 * underneath and peaks exactly when applyTheme() runs, so the world changes
 * under cover rather than popping mid-frame.
 *
 * The file is large, so it is NEVER eagerly downloaded: it preloads only when
 * the user hovers/focuses the toggle (real intent), and any flip that happens
 * before it is ready falls back to a fast scrim-only swap. All timing is
 * wall-clock, so a throttled frame loop can't strand the overlay.
 */
const RATE = 2.6; // play the sweep fast enough to feel like a transition
const FADE_IN = 190;
const SWAP_AT = 700; // scrim is at peak here — swap the world
const HOLD = 1150; // sweep keeps playing past the swap
const FADE_OUT = 430;
const TOTAL = SWAP_AT + HOLD + FADE_OUT;

type Stage = "idle" | "run";

export default function ThemeTransition() {
  const [stage, setStage] = useState<Stage>("idle");
  const [phase, setPhase] = useState<"in" | "peak" | "out">("in");
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef<Theme>("space");
  const timers = useRef<number[]>([]);
  const prefetched = useRef(false);
  const [videoOk, setVideoOk] = useState(false);

  // Only pull the clip down once the user shows intent on the toggle.
  const prefetch = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    const v = videoRef.current;
    if (!v) return;
    v.preload = "auto";
    v.load();
  }, []);

  useEffect(() => {
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('button[aria-label*="mode"]')) prefetch();
    };
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("focusin", onOver, true);
    return () => {
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("focusin", onOver, true);
    };
  }, [prefetch]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const onFlip = (e: Event) => {
      const { theme } = (e as CustomEvent<{ theme: Theme }>).detail;
      clear();
      target.current = theme;

      const v = videoRef.current;
      // HAVE_CURRENT_DATA or better — otherwise scrim-only fallback
      const ready = !!v && v.readyState >= 2;
      setVideoOk(ready);
      if (!ready) prefetch(); // warm it up for next time

      if (ready && v) {
        try {
          v.currentTime = 0;
          v.playbackRate = RATE;
          void v.play().catch(() => {});
        } catch {
          /* seeking can throw mid-load — scrim still carries the swap */
        }
      }

      setStage("run");
      setPhase("in");
      timers.current.push(window.setTimeout(() => setPhase("peak"), FADE_IN));
      timers.current.push(
        window.setTimeout(() => applyTheme(target.current), SWAP_AT)
      );
      timers.current.push(
        window.setTimeout(() => setPhase("out"), SWAP_AT + HOLD)
      );
      timers.current.push(
        window.setTimeout(() => {
          setStage("idle");
          const vid = videoRef.current;
          if (vid) {
            vid.pause();
            try {
              vid.currentTime = 0;
            } catch {
              /* ignore */
            }
          }
        }, TOTAL)
      );
    };

    window.addEventListener(FLIP_EVENT, onFlip);
    return () => {
      window.removeEventListener(FLIP_EVENT, onFlip);
      clear();
    };
  }, [prefetch]);

  const running = stage === "run";
  // Scrim colour is the world we're arriving at.
  const scrim =
    target.current === "sun"
      ? "radial-gradient(circle at 62% 45%, #FFFDF6 0%, #FFE9A8 45%, #F6C070 100%)"
      : "radial-gradient(circle at 62% 45%, #1b1636 0%, #0A0C14 55%, #05060A 100%)";

  const scrimOpacity = !running ? 0 : phase === "out" ? 0 : phase === "peak" ? 0.92 : 0.35;
  const videoOpacity = !running || !videoOk ? 0 : phase === "out" ? 0 : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[250]"
      style={{ visibility: running ? "visible" : "hidden" }}
    >
      {/* theme-coloured cover: peaks at the swap moment */}
      <div
        className="absolute inset-0"
        style={{
          background: scrim,
          opacity: scrimOpacity,
          transition: `opacity ${
            phase === "out" ? FADE_OUT : FADE_IN
          }ms cubic-bezier(.4,0,.2,1)`,
        }}
      />
      {/* the light sweep — screen blend drops its darks out */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          mixBlendMode: "screen",
          opacity: videoOpacity,
          transition: `opacity ${
            phase === "out" ? FADE_OUT : FADE_IN
          }ms cubic-bezier(.4,0,.2,1)`,
        }}
      >
        <source src="/transition.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
