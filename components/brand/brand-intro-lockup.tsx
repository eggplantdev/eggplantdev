"use client";

import { cn } from "@/helpers/cn";

import { SCATTER_MS, WORDMARK } from "./brand-intro-config";
import { AnimatedBrandLogo } from "./animated-brand-logo";
import { IntroWordmark } from "./intro-wordmark";

// The centered hero brand mark: the full-size dot logo scatters into place, then the tagline cascades
// in letter-by-letter (held until the dots have assembled). The parent <section> owns the full-height
// centering.
const FULL_LOGO_CLASS = "size-32 md:size-60";

export function BrandIntroLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <AnimatedBrandLogo className={FULL_LOGO_CLASS} />
      <IntroWordmark text={WORDMARK} delay={SCATTER_MS / 1000} className="mt-3" />
    </div>
  );
}
