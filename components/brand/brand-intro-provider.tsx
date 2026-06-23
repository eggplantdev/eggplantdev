"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { motion } from "framer-motion";

import { FixedTravelingDots } from "@/components/animations/fixed-traveling-dots/fixed-traveling-dots";
import { GritPulseOverlay } from "@/components/animations/grit-pulse-overlay/grit-pulse-overlay";

import { AnimatedBrandLogo } from "./animated-brand-logo";
import { ALWAYS_PLAY, HERO_MODE, SCATTER_MS, SEEN_KEY, VEIL_FADE_S } from "./brand-intro-config";
import { BrandIntroContext, WORDMARK } from "./brand-intro-context";
import { getBrandIntroPhase, getBrandIntroServerPhase, subscribeBrandIntro } from "./brand-intro-store";
import { IntroWordmark } from "./intro-wordmark";

// Synchronous pre-paint decision, mirroring the skip branch of the store. Runs from the SSR HTML
// before the page content is parsed, so a returning-this-session / reduced-motion visitor never sees the
// veil — it's `display:none`'d (globals.css) from the very first paint, instead of a blank brand screen
// that lingers until the JS bundle hydrates. First-time visitors fall through to the default (veil up).
// Wrapped in try/catch because sessionStorage throws in some privacy modes — failing open = intro plays.
const SEEN_CHECK = ALWAYS_PLAY ? "false" : "seen";
const NO_FLASH_SCRIPT = `(function(){try{var seen=sessionStorage.getItem('${SEEN_KEY}');var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced||${SEEN_CHECK})document.documentElement.dataset.brandIntro='skip';}catch(e){}})()`;

// Wraps the app to play the brand intro once and morph the splash logo into the nav's <EggplantLogo>.
// Children stay server-rendered (passed through), so a server-component subtree can sit under it.

export function BrandIntroProvider({ children }: { children: ReactNode }) {
  // The phase is owned by an external store (brand-intro-store) that advances itself via timers. Reading
  // it through useSyncExternalStore — instead of render 'idle' then setState the real phase in a mount
  // effect — keeps the decision off React's "setState synchronously in an effect" cascading-render path.
  // getServerSnapshot resolves to 'idle' so SSR + first client render match; the store flips us after.
  const phase = useSyncExternalStore(subscribeBrandIntro, getBrandIntroPhase, getBrandIntroServerPhase);

  const staticHero = HERO_MODE === "static";

  // Lock scroll while the opaque veil is up — the page underneath shouldn't move during the show. Static
  // mode has no veil, so there's nothing to lock behind.
  useEffect(() => {
    if (staticHero || (phase !== "splash" && phase !== "morph")) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase, staticHero]);

  return (
    <BrandIntroContext.Provider value={phase}>
      {/* Must render before {children} so it executes before the page content is parsed/painted. */}
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      {children}

      {/* Opaque veil over the whole page. Rendered from the very first paint (the 'idle' SSR/hydration
          state) so the page is hidden BEFORE the intro starts. It stays opaque through idle → splash →
          morph (content hidden until the logo lands), fades out on 'reveal', and unmounts on 'done'. On
          the skip path it unmounts straight from 'idle' with no fade. z above the grit (z-200) and nav
          (z-99999) so nothing in this portfolio's stack pokes through the veil. */}
      {!staticHero && phase !== "skip" && phase !== "done" && (
        <motion.div
          key="veil"
          data-brand-veil
          className="bg-bgc fixed inset-0 z-100000 overflow-hidden"
          initial={false}
          animate={{ opacity: phase === "reveal" ? 0 : 1 }}
          transition={{ duration: VEIL_FADE_S, ease: "easeOut" }}
        >
          {/* Same ambient backdrop as the rest of the page (grit pulse → traveling dots → grit texture
              over the #010101 base), so the splash reads like the site and dissolves into the page's
              identical bg on reveal. Their fixed positioning resolves against this opacity-animated
              ancestor, filling the veil. The layout's own copies sit underneath, hidden by this veil. */}
          <GritPulseOverlay />
          <FixedTravelingDots />
          <div className="grit pointer-events-none absolute inset-0 z-200 will-change-transform" />
        </motion.div>
      )}

      {/* Splash lockup — logo (layoutId, morphs up to the nav) + tagline (no layoutId; it just fades out
          with the veil). Above the veil so it reads crisp. Unmounts the instant we leave 'splash' so the
          shared-layoutId handoff to the nav logo is clean. */}
      {!staticHero && phase === "splash" && (
        <div className="pointer-events-none fixed inset-0 z-100001 flex flex-col items-center justify-center gap-6 px-6">
          <motion.div layoutId="brand-logo" className="size-44 sm:size-60">
            <AnimatedBrandLogo className="size-full" />
          </motion.div>
          {/* Hold the cascade until the dots have assembled. layoutId hands the tagline off to the hero
              lockup so it glides down with the logo and stays on the page. */}
          <IntroWordmark text={WORDMARK} delay={SCATTER_MS / 1000} layoutId="brand-wordmark" />
        </div>
      )}
    </BrandIntroContext.Provider>
  );
}
