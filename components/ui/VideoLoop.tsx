"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Seamless looping fullscreen video.
//
// A single <video loop> shows a hard cut at the loop point. To hide it we run
// two stacked copies of the same clip and crossfade between them: while clip A
// plays out its final second, clip B (reset to 0) fades in underneath, then we
// swap roles — the seam dissolves and the footage feels continuous.
//
// `fallback` paints behind the videos (shown before load / if playback fails);
// `children` render on top (color washes, legibility gradients).
const FADE = 1.1; // seconds of crossfade before the clip ends

export default function VideoLoop({
  src,
  fallback,
  children,
}: {
  src: string;
  fallback: string;
  children?: ReactNode;
}) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const videos = [a, b];
    let active = 0; // index currently fading IN / playing
    let armed = false; // has the crossfade for this cycle started?

    a.style.opacity = "1";
    b.style.opacity = "0";
    b.pause();

    const onTime = () => {
      const cur = videos[active];
      const nxt = videos[active ^ 1];
      if (!cur.duration || Number.isNaN(cur.duration)) return;

      const remaining = cur.duration - cur.currentTime;

      if (remaining <= FADE && !armed) {
        armed = true;
        nxt.currentTime = 0;
        nxt.play().catch(() => {});
      }

      if (armed) {
        const p = Math.min(1, Math.max(0, (FADE - remaining) / FADE));
        cur.style.opacity = String(1 - p);
        nxt.style.opacity = String(p);
      }
    };

    const onEnded = () => {
      const cur = videos[active];
      cur.style.opacity = "0";
      cur.pause();
      active ^= 1;
      videos[active].style.opacity = "1";
      armed = false;
    };

    a.addEventListener("timeupdate", onTime);
    b.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);

    a.play().catch(() => {});

    return () => {
      a.removeEventListener("timeupdate", onTime);
      b.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: fallback }} />
      <video
        ref={aRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-none"
        style={{ opacity: 1 }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        ref={bRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-none"
        style={{ opacity: 0 }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {children}
    </div>
  );
}
