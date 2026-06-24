"use client";

import Link from "next/link";
import { AnimatedBrandLogo } from "@/components/brand/animated-brand-logo";
import { useIntroDone } from "@/components/brand/brand-intro-store";
import { cn } from "@/helpers/cn";

// Shared so the real mark (dots layer) and the invisible spacers that align the wordmark layer stay the
// exact same width at every breakpoint, and so both layers' lockups land at identical x.
const MARK_SIZE = "size-8 sm:size-10 lg:size-12";
const WORDMARK = "font-mono text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base lg:text-lg";
const LOCKUP = "-ml-3 flex items-center gap-2 py-5";

export function EggplantLogo() {
  // Hold the whole nav lockup hidden while the hero intro plays, then reveal it once that's done.
  // Returning / reduced-motion visitors get it immediately (the store decides — see useIntroDone).
  const introDone = useIntroDone();

  return (
    <>
      {/* Wordmark layer — mix-blend-difference sits on the FIXED layer itself (like the hamburger) so the
          text inverts against the PAGE behind the nav. A blend element nested inside a fixed layer only
          blends within that isolated stacking context, never the page — hence its own layer. Painted at
          full opacity from first render so it's the LCP element at ~FCP; the dots layer's overlay masks it
          during the intro instead of an opacity fade (fading would drop it from LCP until reveal).
          The invisible mark-sized spacer (matching the dots layer's offsets) slots it past the real dots.
          DOM order matters: this layer paints UNDER the dots layer so that layer's overlay can cover it. */}
      <div aria-hidden className="pointer-events-none fixed top-0 right-0 left-0 z-99999 mix-blend-difference">
        <div className="fest-container flex w-full items-start">
          <div className={LOCKUP}>
            <span className={cn("shrink-0", MARK_SIZE)} />
            <span className={cn("text-primary", WORDMARK)}>eggplant_dev</span>
          </div>
        </div>
      </div>

      {/* Mark layer — the colored dot eggplant keeps its true colors (no blend). Owns the home link and the
          background-coloured overlay that masks the whole lockup (dots + the wordmark layer beneath) during
          the hero intro, then fades away. An invisible wordmark copy reserves the width so the overlay spans
          the full lockup and the link stays clickable across it. */}
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-99999">
        <div className="fest-container flex w-full items-start">
          <Link
            href="/"
            aria-label="eggplant_dev — home"
            aria-hidden={!introDone}
            className={cn(
              LOCKUP,
              "pointer-events-auto relative rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <AnimatedBrandLogo entrance={false} className={MARK_SIZE} />
            <span aria-hidden className={cn("opacity-0", WORDMARK)}>
              eggplant_dev
            </span>
            <span
              aria-hidden
              className={cn(
                "bg-bgc pointer-events-none absolute -inset-1 transition-opacity duration-500 ease-out",
                introDone ? "opacity-0" : "opacity-100",
              )}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
