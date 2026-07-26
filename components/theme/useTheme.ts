"use client";

import { useEffect, useState } from "react";

export type Theme = "space" | "sun";

export const THEME_KEY = "kesh-theme";
export const FLIP_EVENT = "kesh:themeflip";

/**
 * Master switch for light mode ("sun"). Keep in sync with the copy in
 * app/layout.tsx, which needs it pre-hydration.
 */
export const LIGHT_MODE_ENABLED = true;

export function getTheme(): Theme {
  if (!LIGHT_MODE_ENABLED) return "space";
  if (typeof document === "undefined") return "space";
  return document.documentElement.dataset.theme === "sun" ? "sun" : "space";
}

/** Raw DOM + storage swap, no animation. Called by ThemeTransition at the
 *  moment the cover is fully closed, so the heavy WebGL scene swap is hidden. */
export function applyTheme(theme: Theme) {
  if (!LIGHT_MODE_ENABLED) theme = "space";
  const root = document.documentElement;
  if (theme === "sun") root.dataset.theme = "sun";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — theme just won't persist */
  }
}

/**
 * Kick off a themed swap. Instead of the View Transitions API (which snapshots
 * the whole page — including the live WebGL canvas — and stutters), we hand off
 * to <ThemeTransition/>: it runs a cheap GPU overlay, calls applyTheme() while
 * the screen is covered, then reveals. Reduced-motion / SSR swap instantly.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  if (!LIGHT_MODE_ENABLED) return;
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    applyTheme(theme);
    return;
  }
  const x = origin?.x ?? window.innerWidth - 48;
  const y = origin?.y ?? 32;
  window.dispatchEvent(
    new CustomEvent(FLIP_EVENT, { detail: { theme, x, y } })
  );
}

/**
 * Reactive theme value for client components (scene manager, toggle…).
 * Watches the <html data-theme> attribute so every consumer stays in sync
 * no matter which component triggered the switch.
 */
export function useTheme(): Theme {
  const [theme, set] = useState<Theme>("space");

  useEffect(() => {
    set(getTheme());
    const mo = new MutationObserver(() => set(getTheme()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  return theme;
}
