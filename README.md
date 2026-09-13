# Kesh Profile — Sukesh Surase Portfolio

localhost: http://localhost:3000 (run in terminal - npm run dev )

A bold, high-energy personal portfolio built with **Next.js 16**, **Tailwind CSS**, and **Framer Motion**. Features glassmorphism UI, an animated aurora background, scroll-driven reveals, an interactive project showcase with shared-layout modals, and a fully responsive layout.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-EC4899)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## Project structure

```
KeshProfile/
├── app/
│   ├── globals.css        # Tailwind layers + glass / gradient utilities
│   ├── layout.tsx         # Fonts (Space Grotesk + Inter), SEO metadata
│   ├── page.tsx           # Assembles all sections
│   └── studio/            # 🔒 Private, local-only Content Studio (see below)
├── components/
│   ├── Navbar.tsx         # Floating glass nav, scroll spy
│   ├── Hero.tsx           # Animated intro + role rotator + CTAs
│   ├── About.tsx          # Bio, interests, stats
│   ├── Skills.tsx         # Animated skill bars (3 categories)
│   ├── AiWorkflow.tsx     # "AI-augmented, human-led" tool cards
│   ├── Projects.tsx       # Interactive project list + cursor preview
│   ├── Certifications.tsx # Credentials (certs + education)
│   ├── Contact.tsx        # Big CTA + prominent clickable contacts block
│   ├── ScrollProgress.tsx # Top gradient progress bar
│   ├── studio/            # Content Studio form primitives + save helpers
│   └── ui/                # Reveal, Magnetic, TiltCard, backgrounds, etc.
├── lib/
│   ├── content.json       # ⭐ ALL site content lives here (edit this)
│   └── data.ts            # Types + typed re-exports of content.json
└── public/
    └── resume.pdf         # ⭐ Replace with the real resume
```

---

## ✏️ How to update content

All content lives in **`lib/content.json`**. There are two ways to edit it:

### Option A — the Content Studio (visual, recommended)

A private, form-based editor for every section (profile, about, skills, AI workflow, projects, credentials, education) with add / remove / reorder.

```bash
npm run dev
# then open http://localhost:3000/studio
```

Edit visually → click **Save → content.json** (Chrome/Edge write the file directly; other browsers use **Download**) → commit the updated `lib/content.json` → deploy.

> **Is this safe on a public site?** Yes. The site is a **static export with no server**, so the Studio only ever runs locally during `npm run dev`. On the live site the `/studio` URL shows a harmless "local editing tool" notice — there is no editor, no login, and no way to change the site — and it's marked `noindex`. It holds no passwords or private data (it only edits the same content that's already public).

### Option B — edit the JSON by hand

Open `lib/content.json` and change the text between the quotes. The site updates instantly while `npm run dev` is running.

| To change… | Edit in `lib/content.json` |
|---|---|
| Name / tagline / email / phone / socials | `profile` |
| Bio paragraphs, interests, stats | `about` |
| Skill categories & percentages | `skillCategories` |
| AI tool cards | `aiWorkflow.tools` |
| Projects (title, description, tech, links) | `projects` |
| Certifications / education | `certifications`, `education` |
| Contact headline & blurb | `contact` |

**Add a new project** — copy an existing block in the `projects` array and change the fields. Set `liveUrl` / `repoUrl` to add source/demo links. `accent` can be `"blue"`, `"azure"`, or `"red"`.

**Show a phone number** — set `profile.phone` (leave it empty to hide the Phone row).

**Replace the resume** — drop your PDF in `public/` named `resume.pdf` (or change `resumeUrl`).

---

## 🎨 Design system — DEEP SPACE ↔ NEAR THE SUN

The site has two complete worlds, switched by the sun/star toggle in the navbar
(persisted in `localStorage`, applied before paint, cross-faded with the View
Transitions API):

| | 🌌 Deep Space (default) | ☀️ Near the Sun (light) |
|---|---|---|
| Backdrop | looping nebula video + warp starfield + meteors | molten sun: pulsing core, breathing corona, wheeling god-rays, golden dust motes |
| Base | near-black `#05060A`, white text | warm ivory `#FFF6E8`, deep bronze text |
| Brand gradient | "Nebula": blue → violet → pink | "Corona": gold → orange → crimson |
| Accents | blue / indigo / red-pink | amber / burnt orange / crimson |

**How it works:** every color is a CSS variable in `app/globals.css`; Tailwind's
`white` is remapped to `var(--fg)` in `tailwind.config.ts`, so all existing
`text-white/60`-style classes re-theme automatically. Scene components live in
`components/ui/` (`SceneManager`, `SunScene`, `Starfield`, `AnimatedBackground`);
the toggle + hook in `components/theme/`. Sun mode clamps faint text alphas up
to keep everything ≥ 4.5:1 WCAG AA on ivory.

- **Type:** Space Grotesk (display) + Inter (body) + Space Mono (mono)
- **Motion:** entrance reveals, magnetic buttons, tilt cards, orbital rings in the hero, cursor spotlight + custom dot, scroll-warp starfield, shooting stars (space), heat shimmer + lens flares (sun). All motion respects `prefers-reduced-motion`.

Tokens live in `tailwind.config.ts` and the utility classes (`.glass`, `.glass-strong`, `.text-gradient`, `.gradient-border`) in `app/globals.css`.

---

## 🚀 Deploy

The live site is on **Netlify**: <https://sukesh-surase-portfolio.netlify.app>

`next.config.mjs` sets `output: "export"`, so `npm run build` emits a
self-contained static site into `out/`. `netlify.toml` tells Netlify to run that
build and publish `out/`; the Node version comes from `.nvmrc`.

Netlify must be connected to this GitHub repo (**Site configuration → Build &
deploy → Continuous deployment**) for a push to `main` to publish. `out/` is
git-ignored, so it is built on Netlify rather than committed — do not "fix" a
failed deploy by committing `out/`.

No environment variables are required for the base site.

---

## 🛠 Optional: add a Sanity.io admin dashboard

The site ships with content in `lib/data.ts` so it works immediately with zero setup. If Sukesh later wants a visual admin dashboard to edit projects/skills without touching code, integrate **Sanity.io**:

```bash
npm create sanity@latest -- --template clean --dataset production
```

Suggested schemas (`/sanity/schemas`):

```ts
// project.ts
export default {
  name: "project", type: "document", title: "Project",
  fields: [
    { name: "title", type: "string" },
    { name: "category", type: "string" },
    { name: "year", type: "string" },
    { name: "description", type: "text" },
    { name: "longDescription", type: "text" },
    { name: "tech", type: "array", of: [{ type: "string" }] },
    { name: "accent", type: "string", options: { list: ["blue", "azure", "red"] } },
    { name: "liveUrl", type: "url" },
    { name: "repoUrl", type: "url" },
    { name: "cover", type: "image" },
    { name: "order", type: "number" },
  ],
};

// skillCategory.ts
export default {
  name: "skillCategory", type: "document", title: "Skill Category",
  fields: [
    { name: "title", type: "string" },
    { name: "accent", type: "string", options: { list: ["blue", "azure", "red"] } },
    { name: "skills", type: "array", of: [{
        type: "object",
        fields: [{ name: "name", type: "string" }, { name: "level", type: "number" }],
    }]},
  ],
};

// siteSettings.ts  → name, roles[], tagline, summary, email, resume (file), socials
```

Then replace the imports in each section with a `client.fetch(groqQuery)` call (use `next-sanity`). The component props are already shaped to match these schemas, so the swap is mostly mechanical. The Sanity Studio (`/studio` route or standalone) becomes the admin dashboard.

---

## ♿ Accessibility & performance

- Semantic landmarks, labelled form inputs, `aria-label`s on icon buttons
- Visible focus states, keyboard-navigable, scroll-spy nav
- `prefers-reduced-motion` honoured globally
- Next.js font optimization, static prerendering, transform/opacity-only animations

---

Built for **Sukesh Surase** — Front-End Developer & Creative Technologist.
[GitHub](https://github.com/Keshz28) · [LinkedIn](https://www.linkedin.com/in/sukesh-surase)
