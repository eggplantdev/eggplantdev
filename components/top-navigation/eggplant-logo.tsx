"use client";

import Link from "next/link";
import { AnimatedBrandLogo } from "@/components/brand/animated-brand-logo";
import { useIntroDone } from "@/components/brand/brand-intro-store";
import { cn } from "@/helpers/cn";

export function EggplantLogo({ className, link = true }: { className?: string; link?: boolean }) {
  const size = cn("size-8 sm:size-10 lg:size-12", className);

  // The nav keeps a plain, already-settled mark — the hero <BrandIntroLockup> owns the dot scatter.
  const logo = <AnimatedBrandLogo entrance={false} className={size} />;

  // Hold the whole nav lockup hidden while the hero intro plays, then fade it in once that's done.
  // Returning / reduced-motion visitors get it immediately (the store decides — see useIntroDone).
  const introDone = useIntroDone();

  // Masked reveal (mirrors AnimatedLettersMask), chosen for LCP: the lockup is painted at full
  // opacity from first render, so the wordmark is the page's LCP element at ~FCP instead of at
  // intro-done (~9s). A background-coloured overlay hides it during the hero intro, then fades
  // away — the text is never *revealed* early, but LCP records its paint time, not the overlay lift.
  // (Fading the lockup's own opacity instead would drop it from LCP until the reveal — the bug we left.)
  const content = (
    <span aria-hidden={!introDone} className="relative flex items-center gap-2">
      {logo}
      <span className="text-primary font-mono text-sm font-semibold tracking-tight whitespace-nowrap mix-blend-difference sm:text-base lg:text-lg">
        eggplant_dev
      </span>
      <span
        aria-hidden
        className={cn(
          "bg-bgc pointer-events-none absolute -inset-1 transition-opacity duration-500 ease-out",
          introDone ? "opacity-0" : "opacity-100",
        )}
      />
    </span>
  );

  if (!link) return content;

  return (
    <Link
      href="/"
      className="pointer-events-auto -ml-3 rounded-md py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      onClick={(e) => {
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {content}
    </Link>
  );
}
