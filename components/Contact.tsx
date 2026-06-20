"use client";

import { profile } from "@/lib/data";
import Reveal from "./ui/Reveal";
import { useClock } from "./ui/useClock";

export default function Contact() {
  const clock = useClock();
  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(70px,14vh,160px)]"
    >
      <Reveal>
        <div className="mb-[clamp(20px,4vh,38px)] font-mono text-xs tracking-[0.2em] text-white/50">
          ( LET&apos;S CONNECT )
        </div>

        <a
          href={`mailto:${profile.email}`}
          data-cursor="hover"
          className="block no-underline"
        >
          <h2 className="m-0 break-words font-display text-[clamp(2rem,10vw,9.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-white">
            Let&apos;s build
            <br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              something
            </span>
          </h2>
        </a>

        <a
          href={`mailto:${profile.email}`}
          data-cursor="hover"
          className="mt-[clamp(22px,4vh,46px)] inline-block border-b-2 border-blue-brand pb-1.5 font-mono text-[clamp(14px,1.8vw,19px)] tracking-[0.04em] text-white no-underline"
        >
          {profile.email} →
        </a>
      </Reveal>

      <footer className="mt-[clamp(60px,12vh,130px)] flex flex-wrap justify-between gap-3.5 border-t border-white/10 py-6 font-mono text-[11px] tracking-[0.1em] text-white/50">
        <span>© {year} SUKESH SURASE</span>
        <span className="flex gap-5">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="text-white/50 no-underline transition-colors hover:text-white"
          >
            GITHUB
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="text-white/50 no-underline transition-colors hover:text-white"
          >
            LINKEDIN
          </a>
        </span>
        <span>
          <span className="tabular-nums">{clock}</span> — REMOTE
        </span>
      </footer>
    </section>
  );
}
