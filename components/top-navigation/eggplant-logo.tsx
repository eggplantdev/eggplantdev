"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
