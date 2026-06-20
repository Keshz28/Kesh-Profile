"use client";

import { certifications, education } from "@/lib/data";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

type Credential = {
  kind: string;
  title: string;
  issuer: string;
  year?: string;
};

// Merge certifications + education into one unified credential list.
const credentials: Credential[] = [
  ...certifications.map((c) => ({
    kind: "Certification",
    title: c.title,
    issuer: c.issuer,
    year: c.year,
  })),
  ...education.map((e) => ({
    kind: e.kind,
    title: e.degree,
    issuer: e.institution,
    year: e.year,
  })),
];

export default function Certifications() {
  return (
    <section
      id="certs"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-7 font-mono text-xs tracking-[0.2em] text-blue-glow">
        ( 04 — CREDENTIALS )
      </Reveal>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
        {credentials.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <TiltCard className="flex h-full flex-col rounded-[18px] border border-white/10 bg-white/[0.035] p-[22px] backdrop-blur-[10px]">
              <div className="mb-3.5 flex items-center justify-between">
                <span className="rounded-full border border-blue-glow/30 px-2.5 py-[5px] font-mono text-[10px] uppercase tracking-[0.12em] text-blue-glow">
                  {c.kind}
                </span>
                {c.year ? (
                  <span className="font-mono text-[11px] text-white/45">
                    {c.year}
                  </span>
                ) : null}
              </div>
              <h3 className="mb-1.5 font-display text-[17px] font-semibold leading-[1.25] text-white">
                {c.title}
              </h3>
              <div className="font-mono text-xs text-white/55">{c.issuer}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
