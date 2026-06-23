"use client";

import { motion } from "framer-motion";

import { cn } from "@/helpers/cn";

import { HERO_MODE, SCATTER_MS } from "./brand-intro-config";
import { AnimatedBrandLogo } from "./animated-brand-logo";
import { useBrandIntro, WORDMARK } from "./brand-intro-context";
import { IntroWordmark } from "./intro-wordmark";

// Splash size — the mark at full height, used by the "static" test variant (no scale-down).
const FULL_LOGO_CLASS = "size-32 sm:size-60";

// Where the splash lockup lands. Lives in the page hero (under <BrandIntroProvider>); it consumes the
// intro phase and renders the logo + wordmark as a placeholder → morph target → settled mark. The splash
// logo + tagline glide DOWN into this via the shared layoutIds and STAY — they no longer morph up into
// the nav (the nav now keeps its own plain mark).

// Decelerating glide (easeOutExpo) shared by logo + wordmark so the lockup lands as one piece.
const MORPH_TRANSITION = { layout: { duration: 1, ease: [0.22, 1, 0.36, 1] } } as const;

// Lands smaller than the splash mark (size-44/60) — centered hero scale, matching Eggplant Notes.
const LOGO_CLASS = "size-20 sm:size-24";
const WORDMARK_CLASS = "mt-3 text-center font-mono text-lg font-semibold tracking-tight whitespace-pre-line sm:text-xl";

export function BrandIntroLockup({ className }: { className?: string }) {
  const phase = useBrandIntro();
  const root = cn("flex flex-col items-center text-center", className);

  // TEST variant: no splash, no morph — the full-size mark scatters in place, then the tagline cascades
  // in letter-by-letter (same animation + size as the splash's first phase). The parent section owns the
  // full-height centering; ignores `phase` entirely (the provider doesn't run the veil/splash here).
  if (HERO_MODE === "static") {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <AnimatedBrandLogo className={FULL_LOGO_CLASS} />
        {/* Hold the cascade until the dots have assembled, like the splash. */}
        <IntroWordmark text={WORDMARK} delay={SCATTER_MS / 1000} className="mt-3" />
      </div>
    );
  }

  // Splash layer owns the visible lockup; reserve its footprint here so the page layout doesn't shift.
  if (phase === "splash") {
    return (
      <div aria-hidden className={root}>
        <div className={LOGO_CLASS} />
        <div className={cn(WORDMARK_CLASS, "invisible")}>{WORDMARK}</div>
      </div>
    );
  }

  // Handoff (morph + reveal): morph targets carrying the shared layoutIds, z-lifted above the still-opaque
  // veil so they read crisp the whole way down into the hero.
  if (phase === "morph" || phase === "reveal") {
    return (
      <div className={root}>
        <motion.div layoutId="brand-logo" transition={MORPH_TRANSITION} className={cn("relative z-100001", LOGO_CLASS)}>
          <AnimatedBrandLogo entrance={false} className="size-full" />
        </motion.div>
        <motion.div
          layoutId="brand-wordmark"
          transition={MORPH_TRANSITION}
          className={cn("relative z-100001", WORDMARK_CLASS)}
        >
          {WORDMARK}
        </motion.div>
      </div>
    );
  }

  // done — settled mark, no layoutId/z lift (so it can't overlap a sticky nav on scroll).
  if (phase === "done") {
    return (
      <div className={root}>
        <AnimatedBrandLogo entrance={false} className={LOGO_CLASS} />
        <p className={WORDMARK_CLASS}>{WORDMARK}</p>
      </div>
    );
  }

  // idle (intro not yet decided) + skip (returning visitor / reduced motion): scatter in place.
  return (
    <div className={root}>
      <AnimatedBrandLogo className={LOGO_CLASS} />
      <p className={WORDMARK_CLASS}>{WORDMARK}</p>
    </div>
  );
}
