"use client";

import { useTheme } from "../theme/useTheme";
import SunScene from "./SunScene";
import Starfield from "./Starfield";
import SpaceScene from "./SpaceScene";

/**
 * Mounts the backdrop that matches the active theme:
 *   space → looping darkmode.mp4 on desktop, static nebula on mobile
 *   sun   → looping lightmode.mp4 on desktop, static corona on mobile
 * The DOM starfield layers foreground twinkle/meteors (space) or dust (sun)
 * on top of whichever backdrop is active.
 */
export default function SceneManager() {
  const theme = useTheme();

  return (
    <>
      {theme === "sun" ? <SunScene /> : <SpaceScene />}
      <Starfield theme={theme} />
    </>
  );
}
