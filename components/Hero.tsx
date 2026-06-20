"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import { useClock } from "./ui/useClock";
import Magnetic from "./ui/Magnetic";

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
  const heroY = useTransform(scrollY, [0, 600], [0, 60]);
  const clock = useClock();

  return (
    <section
      id="home"
      className="relative z-[5] flex min-h-screen flex-col justify-center px-[clamp(20px,5vw,72px)] pb-[70px] pt-[130px] text-center"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        {/* availability badge */}
        <div
          className="mb-[clamp(20px,4vh,40px)] inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-full border border-blue-glow/25 bg-blue-brand/[0.12] px-4 py-[7px] text-center font-mono text-[11px] tracking-[0.06em] text-white/[0.78] backdrop-blur-sm sm:text-xs"
          style={{ animation: "fadeUp 1s .1s both" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-glow opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-brand" />
          </span>
          Open to opportunities · Available worldwide
        </div>

        {/* name */}
        <motion.h1
          style={{ y: heroY }}
          className="m-0 font-display text-[clamp(3.2rem,12.5vw,12rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] will-change-transform"
        >
          <span
            className="block"
            style={{ textShadow: "0 0 80px rgba(37,99,235,0.30), 0 0 160px rgba(99,102,241,0.15)" }}
          >
            <span className="block overflow-hidden">
              <span
                className="inline-block"
                style={{ animation: "riseIn 1s .15s both" }}
              >
                Sukesh
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="bg-brand-gradient inline-block bg-clip-text text-transparent"
                style={{
                  backgroundSize: "220% 220%",
                  animation:
                    "riseIn 1s .3s both, gradShift 7s 1.3s ease-in-out infinite",
                }}
              >
                Surase
              </span>
            </span>
          </span>
        </motion.h1>

        {/* role rotator */}
        <div
          className="mt-[clamp(18px,3.5vh,38px)] flex flex-wrap items-baseline justify-center gap-3 font-display text-[clamp(1.1rem,3.2vw,2.1rem)] font-semibold"
          style={{ animation: "fadeUp 1s .5s both" }}
        >
          <span className="text-white/55">I&apos;m a</span>
          <RoleRotator />
        </div>

        {/* tagline */}
        <p className="mx-auto mt-[clamp(20px,4vh,34px)] max-w-[660px] text-pretty text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.65] text-white/[0.62]">
          {profile.tagline}
        </p>

        {/* CTAs */}
        <div
          className="mt-[clamp(28px,5vh,46px)] flex flex-wrap justify-center gap-3.5"
          style={{ animation: "fadeUp 1s .7s both" }}
        >
          <Magnetic>
            <a
              href="#projects"
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-[14px] bg-brand-gradient px-[26px] py-3.5 font-display text-[15px] font-bold text-ink"
            >
              View Projects ↗
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resumeUrl}
              download
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-[14px] border border-white/15 bg-white/5 px-[26px] py-3.5 font-display text-[15px] font-semibold text-white backdrop-blur-md"
            >
              ↓ Download Resume
            </a>
          </Magnetic>
        </div>

        {/* socials */}
        <div
          className="mt-[clamp(26px,4vh,38px)] flex flex-wrap justify-center gap-2.5"
          style={{ animation: "fadeUp 1s .85s both" }}
        >
          <SocialPill href={profile.socials.github}>GitHub</SocialPill>
          <SocialPill href={profile.socials.linkedin}>LinkedIn</SocialPill>
          <SocialPill href={`mailto:${profile.email}`}>{profile.email}</SocialPill>
        </div>
      </div>

      {/* top-right meta + live clock */}
      <div className="absolute right-[clamp(20px,5vw,72px)] top-[clamp(100px,13vh,140px)] hidden text-right font-mono text-[11px] leading-[1.9] tracking-[0.14em] text-white/40 sm:block">
        <div>PORTFOLIO / 2026</div>
        <div className="text-blue-glow tabular-nums">{clock}</div>
      </div>

      {/* scroll hint */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-[30px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[7px] font-mono text-[10px] tracking-[0.25em] text-white/50"
      >
        SCROLL
        <span className="inline-block" style={{ animation: "bob 1.8s infinite" }}>
          ↓
        </span>
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
