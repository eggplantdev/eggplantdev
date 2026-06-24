"use client";

import Link from "next/link";
import { AnimatedBrandLogo } from "@/components/brand/animated-brand-logo";
import { cn } from "@/helpers/cn";

// Shared so the dots layer and the invisible spacer that aligns the wordmark layer keep the exact same
// width at every breakpoint, and so both layers' lockups land at identical x.
const MARK_SIZE = "size-8 sm:size-10 lg:size-12";
const WORDMARK = "font-mono text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base lg:text-lg";
const LOCKUP = "-ml-3 flex items-center gap-2 py-5";

export function EggplantLogo() {
  // The lockup paints at first render — no hidden/deferred reveal. A deferred reveal turned the wordmark
  // into a LATE LCP paint on mobile: gated behind a post-hydration timer, it landed ~9s on a throttled
  // phone and stole LCP from the hero (desktop was unaffected — the hero dwarfs the wordmark there).
  // Painting immediately keeps LCP on the hero at FCP. The dot scatter is the only intro now.
  return (
    <>
      {/* Wordmark layer — mix-blend-difference sits on the FIXED layer itself (like the hamburger) so the
          text inverts against the PAGE behind the nav. A blend element nested inside a fixed layer only
          blends within that isolated stacking context, never the page — hence its own layer. The invisible
          mark-sized spacer (matching the dots layer's offsets) slots it past the real dots. */}
      <div aria-hidden className="pointer-events-none fixed top-0 right-0 left-0 z-99999 mix-blend-difference">
        <div className="fest-container flex w-full items-start">
          <div className={LOCKUP}>
            <span className={cn("shrink-0", MARK_SIZE)} />
            <span className={cn("text-primary", WORDMARK)}>eggplant_dev</span>
          </div>
        </div>
      </div>

      {/* Mark layer — the colored dot eggplant keeps its true colors (no blend) and owns the home link. An
          invisible wordmark copy reserves the width so the link stays clickable across the whole lockup. */}
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-99999">
        <div className="fest-container flex w-full items-start">
          <Link
            href="/"
            aria-label="eggplant_dev — home"
            className={cn(
              LOCKUP,
              "pointer-events-auto rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
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
          </Link>
        </div>
      </div>
    </>
  );
}
