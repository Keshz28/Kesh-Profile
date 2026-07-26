"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import Magnetic from "./ui/Magnetic";
import GravityText from "./ui/GravityText";
import { useTheme } from "./theme/useTheme";

// GravityText colours each glyph from an explicit ramp (background-clip can't
// survive per-glyph transforms), so the ramp has to be picked per theme —
// nebula blues are unreadable on the light page.
const NAME_RAMP = {
  space: ["#3b82f6", "#7c3aed", "#ec4899"],
  sun: ["#a1520a", "#b4400c", "#a01b1b"],
} as const;

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((p) => (p + 1) % profile.roles.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        key={profile.roles[i]}
        className="text-gradient inline-block"
        style={{ animation: "wordIn .55s cubic-bezier(.16,1,.3,1) both" }}
      >
        {profile.roles[i]}
      </span>
    </span>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 70]);
  const theme = useTheme();

  return (
    <section
      id="home"
      className="relative z-[5] flex min-h-screen flex-col justify-center px-[clamp(20px,4.5vw,64px)] pb-[clamp(54px,7vh,88px)] pt-[clamp(92px,11vh,120px)]"
    >
      {/* Single left-weighted column — the right half is deliberately left
          open so the WebGL black hole reads as the hero's centrepiece. */}
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="max-w-[min(100%,720px)]">
          {/* availability */}
          <div
            className="mb-[clamp(16px,2.8vh,32px)] inline-flex items-center gap-2.5 rounded-full border border-blue-glow/25 bg-blue-brand/[0.12] px-4 py-[7px] font-mono text-[11px] tracking-[0.06em] text-white/[0.78] backdrop-blur-sm sm:text-xs"
            style={{ animation: "fadeUp 1s .1s both" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-glow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-brand" />
            </span>
            Open to opportunities · Available worldwide
          </div>

          {/* name — glyphs arrive as debris, settle, then bend around the cursor */}
          <motion.h1
            style={{ y: heroY }}
            className="m-0 font-display text-[clamp(2.75rem,8.4vw,7.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] will-change-transform"
          >
            <GravityText
              text="Sukesh"
              delay={0.15}
              className="block text-white"
              style={{ textShadow: "var(--halo)" }}
            />
            <GravityText
              key={theme}
              text="Surase"
              delay={0.32}
              gradient={[...NAME_RAMP[theme]]}
              className="block"
            />
          </motion.h1>

          {/* role */}
          <div
            className="mt-[clamp(14px,2.4vh,28px)] flex flex-wrap items-baseline gap-3 font-display text-[clamp(1.1rem,2.7vw,1.85rem)] font-semibold"
            style={{ animation: "fadeUp 1s .55s both" }}
          >
            <span className="text-white/55">I&apos;m a</span>
            <RoleRotator />
          </div>

          {/* tagline */}
          <p
            className="mt-[clamp(12px,2.2vh,24px)] max-w-[540px] text-pretty text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.6] text-white/[0.62]"
            style={{ animation: "fadeUp 1s .7s both" }}
          >
            {profile.tagline}
          </p>

          {/* CTAs */}
          <div
            className="mt-[clamp(18px,3.2vh,34px)] flex flex-wrap gap-3.5"
            style={{ animation: "fadeUp 1s .82s both" }}
          >
            <Magnetic>
              <a
                href="#projects"
                data-cursor="hover"
                className="cta-galaxy inline-flex items-center gap-2 rounded-[14px] bg-brand-gradient px-[26px] py-3.5 font-display text-[15px] font-bold text-ink"
              >
                <span>View Projects ↗</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resumeUrl}
                download
                data-cursor="hover"
                className="cta-gravity inline-flex items-center gap-2 rounded-[14px] border border-white/15 bg-white/5 px-[26px] py-3.5 font-display text-[15px] font-semibold text-white backdrop-blur-md"
              >
                ↓ Download Resume
              </a>
            </Magnetic>
          </div>

          {/* socials */}
          <div
            className="mt-[clamp(14px,2.4vh,26px)] flex flex-wrap gap-2.5"
            style={{ animation: "fadeUp 1s .95s both" }}
          >
            <SocialPill href={profile.socials.github}>GitHub</SocialPill>
            <SocialPill href={profile.socials.linkedin}>LinkedIn</SocialPill>
            <SocialPill href={`mailto:${profile.email}`}>{profile.email}</SocialPill>
          </div>
        </div>
      </div>

      {/* vertical meta label pinned to the section's right edge */}
      <span
        aria-hidden
        className="absolute right-[clamp(14px,2vw,28px)] top-1/2 hidden -translate-y-1/2 font-mono text-[10px] tracking-[0.3em] text-white/35 lg:block"
        style={{ writingMode: "vertical-rl", animation: "fadeUp 1.2s 1.1s both" }}
      >
        EARTH · SOL SYSTEM · {new Date().getFullYear()}
      </span>

      {/* scroll hint */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-[26px] left-[clamp(20px,4.5vw,64px)] flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] text-white/50"
      >
        <span className="inline-block" style={{ animation: "bob 1.8s infinite" }}>
          ↓
        </span>
        SCROLL
      </a>
    </section>
  );
}

function SocialPill({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      data-cursor="hover"
      className="inline-flex h-[42px] items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 font-mono text-xs tracking-[0.06em] text-white/[0.78] transition-colors duration-200 hover:border-white/25 hover:text-white"
    >
      {children}
    </a>
  );
}
