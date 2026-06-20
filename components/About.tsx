"use client";

import { useEffect, useRef, useState } from "react";
import { about } from "@/lib/data";
import Reveal from "./ui/Reveal";

// Counts up from 0 → target the first time it scrolls into view, preserving any
// non-numeric suffix ("+", "%").
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.trim().match(/^(\d+)(.*)$/);
    if (!m) {
      setDisplay(value);
      return;
    }
    const target = +m[1];
    const suffix = m[2] || "";
    setDisplay("0" + suffix);

    let started = false;
    const run = () => {
      const t0 = performance.now();
      const dur = 1300;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(e * target) + suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="text-gradient font-display text-[clamp(1.9rem,6vw,4rem)] font-bold leading-none"
    >
      {display}
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] py-[clamp(70px,12vh,140px)]"
    >
      <Reveal className="mb-6 font-mono text-xs tracking-[0.2em] text-blue-glow">
        ( 01 — ABOUT )
      </Reveal>

      <div className="grid gap-[clamp(32px,6vw,80px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
        <Reveal>
          <h2 className="m-0 font-display text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            Building across the{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              entire stack.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`mb-[18px] text-pretty text-[clamp(1rem,1.4vw,1.12rem)] leading-[1.75] last:mb-0 ${
                i === 0 ? "text-white/[0.72]" : "text-white/[0.6]"
              }`}
            >
              {p}
            </p>
          ))}

          <div className="mt-6 flex flex-wrap gap-2">
            {about.interests.map((it) => (
              <span
                key={it}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-[7px] font-mono text-[11px] tracking-[0.04em] text-white/[0.72]"
              >
                {it}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={0.2}
        className="mt-[clamp(40px,7vh,72px)] grid grid-cols-3 gap-[clamp(12px,3vw,28px)]"
      >
        {about.stats.map((s) => (
          <div key={s.label} className="min-w-0 border-t border-white/10 pt-[18px]">
            <CountUp value={s.value} />
            <div className="mt-2.5 font-mono text-[11px] tracking-[0.08em] text-white/55">
              {s.label}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
