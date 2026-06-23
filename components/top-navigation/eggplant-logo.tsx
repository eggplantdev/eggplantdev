"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedBrandLogo } from "@/components/brand/animated-brand-logo";
import { NAV_LOGO_ANIMATED } from "@/components/brand/brand-intro-config";
import { useBrandIntro } from "@/components/brand/brand-intro-context";
import { cn } from "@/helpers/cn";

export function EggplantLogo({ className, link = true }: { className?: string; link?: boolean }) {
  const phase = useBrandIntro();
  const size = cn("size-8 sm:size-10 lg:size-12", className);

  // The splash now morphs into the hero <BrandIntroLockup>, not here — the nav just keeps a plain mark.
  // It sits behind the opaque veil through splash/morph (nav z-99999 < veil z-100000), so render it
  // already settled there; it's uncovered, fully assembled, when the veil dissolves on reveal. Only the
  // veil-less paths (idle before the decision, skip for returning/reduced-motion visitors) scatter it in.
  const scatterIn = NAV_LOGO_ANIMATED && (phase === "idle" || phase === "skip");
  const logo = <AnimatedBrandLogo entrance={scatterIn} className={size} />;

  // Hold the whole nav lockup hidden while the hero intro animation plays, then fade it in once that's
  // done: the splash/morph flow lands on 'reveal'/'done'; returning / reduced-motion visitors hit 'skip'
  // with no intro to wait on. 'idle' + 'splash' + 'morph' are the animating window — stay invisible.
  const introDone = phase === "reveal" || phase === "done" || phase === "skip";

  const content = (
    <motion.span
      aria-hidden={!introDone}
      className="flex items-center gap-2"
      initial={false}
      animate={{ opacity: introDone ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {logo}
      <span className="text-primary font-mono text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base lg:text-lg">
        eggplant_dev
      </span>
    </motion.span>
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
