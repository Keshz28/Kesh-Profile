"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/lib/data";
import Reveal from "./ui/Reveal";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [visible, setVisible] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  // Floating preview trails the cursor while a row is hovered.
  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf || !hoveredRef.current) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = previewRef.current;
        if (!el) return;
        const px = Math.min(x + 26, window.innerWidth - 340);
        const py = Math.min(Math.max(y - 150, 16), window.innerHeight - 260);
        el.style.transform = `translate(${px}px,${py}px)`;
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const enter = (p: Project) => {
    setActive(p);
    setVisible(true);
    hoveredRef.current = true;
  };
  const leave = () => {
    setVisible(false);
    hoveredRef.current = false;
  };

  return (
    <section
      id="projects"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(20px,4vh,44px)] flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <div className="mb-4 font-mono text-xs tracking-[0.2em] text-blue-glow">
            ( 03 — SELECTED WORK )
          </div>
          <h2 className="m-0 font-display text-[clamp(2rem,6vw,4.6rem)] font-bold leading-[0.92] tracking-[-0.02em]">
            Projects
          </h2>
        </div>
        <span className="font-mono text-xs tracking-[0.12em] text-white/50">
          [ 04 — 2026 ]
        </span>
      </Reveal>

      <div className="border-t border-white/10">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <a
              href="#contact"
              data-cursor="hover"
              onMouseEnter={() => enter(p)}
              onMouseLeave={leave}
              className="group grid grid-cols-[40px_1fr_auto_22px] items-center gap-3 border-b border-white/10 px-2 py-[clamp(18px,3vh,32px)] text-[#e7e9f0] no-underline transition-[padding,background] duration-[0.45s] ease-out hover:bg-white/[0.04] hover:px-[22px] sm:grid-cols-[60px_1fr_auto_26px] sm:gap-[18px]"
            >
              <span className="bg-brand-gradient bg-clip-text font-mono text-[13px] text-transparent">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="block break-words font-display text-[clamp(1.5rem,4.5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.01em]">
                  {p.title}
                </span>
                <span className="mt-1.5 block max-w-[60ch] text-[clamp(0.85rem,1.4vw,1rem)] text-white/50">
                  {p.description}
                </span>
              </span>

              <span className="hidden whitespace-nowrap text-right font-mono text-[11px] tracking-[0.1em] text-white/55 sm:block">
                {p.category}
                <br />
                {p.year}
              </span>

              <span className="font-display text-[22px] leading-none text-white opacity-0 -translate-x-2 transition-[opacity,transform] duration-[0.4s] group-hover:translate-x-0 group-hover:opacity-100">
                ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* floating cursor-following preview */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] w-[320px] will-change-transform"
        style={{ opacity: visible ? 1 : 0, transition: "opacity .4s ease" }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[rgba(14,16,25,0.85)] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-[14px]">
          <div className="h-[5px] bg-brand-gradient" />
          <div className="p-[18px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-glow">
              {active?.category}
            </div>
            <div className="mt-2 font-display text-2xl font-bold leading-[1.1] text-white">
              {active?.title}
            </div>
            <div className="mt-3 font-mono text-[11px] leading-[1.6] tracking-[0.06em] text-white/55">
              {active?.tech.join(" · ")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
