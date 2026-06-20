"use client";

import { motion } from "framer-motion";
import { skillCategories, type SkillCategory } from "@/lib/data";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

const EASE = [0.16, 1, 0.3, 1] as const;

function SkillCard({ cat, delay }: { cat: SkillCategory; delay: number }) {
  return (
    <Reveal delay={delay}>
      <TiltCard className="rounded-[18px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-[10px]">
        <h3 className="mb-5 font-display text-[18px] font-semibold text-white">
          {cat.title}
        </h3>

        {cat.skills.map((sk, i) => (
          <div key={sk.name} className="mb-[15px] last:mb-0">
            <div className="mb-[7px] flex justify-between font-mono text-xs text-white/70">
              <span>{sk.name}</span>
              <span className="text-white/40">{sk.level}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ width: 0 }}
                whileInView={{ width: `${sk.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: delay + 0.1 + i * 0.06, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </TiltCard>
    </Reveal>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(28px,5vh,52px)] flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <div className="mb-4 font-mono text-xs tracking-[0.2em] text-blue-glow">
            ( 02 — SKILLS )
          </div>
          <h2 className="m-0 font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            What I bring
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        {skillCategories.map((cat, i) => (
          <SkillCard key={cat.title} cat={cat} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
