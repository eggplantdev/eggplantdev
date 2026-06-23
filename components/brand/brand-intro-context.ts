"use client";

import { createContext, useContext } from "react";

// The tagline shown under the logo. Single source so the splash lockup can't drift from whatever the
// timing math measures. The `\n` forces a fixed two-line break ("Websites and apps" / "for taste
// seekers") in BOTH the big splash and the scaled-down hero — otherwise width-based wrapping breaks
// differently at the two sizes and the layout visibly jumps after the morph. Render with the line break
// honored: `whitespace-pre-line` for the static copies, an explicit row break for the letter cascade.
export const WORDMARK = "Websites and apps\nfor taste seekers";

// The brand intro's lifecycle, consumed by the nav lockup so the splash logo can hand off to it.
//   idle   — SSR + first client render; behaves as a normal mark (matches server HTML)
//   splash — full-screen veil owns a scaled-up scatter + tagline; the nav logo is a hidden placeholder
//   morph  — nav logo glides up from the splash (layoutId) while the veil STAYS opaque, content hidden
//   reveal — veil dissolves; page content fades up behind the settled lockup
//   done   — cleanup; the nav logo is a plain settled mark (no layoutId/z lift to outlive the anim)
//   skip   — no veil (returning visitor this session, or reduced motion); the mark scatters in place
export type BrandIntroPhaseT = "idle" | "splash" | "morph" | "reveal" | "done" | "skip";

export const BrandIntroContext = createContext<BrandIntroPhaseT>("idle");

export function useBrandIntro() {
  return useContext(BrandIntroContext);
}
