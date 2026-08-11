import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

// New statement display face — expressive, editorial, great at huge sizes.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Kept for the numbered nav / secondary UI accents.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.roles[0]}`,
  description: profile.summary,
  keywords: [
    profile.name,
    "Full-Stack Developer",
    "UI/UX Designer",
    "Web Designer",
    "XR Developer",
    "Portfolio",
    "React",
    "Next.js",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint so a saved "sun" theme never flashes deep-space first.
// LIGHT_MODE_ENABLED is hardcoded here (not imported) since this string runs
// pre-hydration; keep it in sync with components/theme/useTheme.ts. While
// light mode is disabled this also scrubs any stale "sun" value so a past
// visit can't silently re-enable it once the flag flips back on later.
const LIGHT_MODE_ENABLED = false;
const themeInit = LIGHT_MODE_ENABLED
  ? `try{if(localStorage.getItem("kesh-theme")==="sun")document.documentElement.dataset.theme="sun"}catch(e){}`
  : `try{localStorage.removeItem("kesh-theme")}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased">
        {/* runs before hydration so a saved "sun" theme never flashes */}
        <Script id="kesh-theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        {children}
      </body>
    </html>
  );
}
