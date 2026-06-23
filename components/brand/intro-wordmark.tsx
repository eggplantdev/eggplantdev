"use client";

import { motion, type Variants } from "framer-motion";

import { cn } from "@/helpers/cn";

// The tagline revealed letter-by-letter during the splash — a framer-motion cascade where each char is
// its own span so the container's staggerChildren walks them in sequence.

const STAGGER_S = 0.05; // gap between letters starting
const LETTER_S = 0.4; // each letter's own fade-up

// How long the full cascade takes once it starts, given the text. Exported so the intro derives its
// reveal timing from the real string instead of a hardcoded guess that drifts if the copy changes.
export function wordmarkDurationMs(text: string) {
  return (text.length * STAGGER_S + LETTER_S) * 1000;
}

const letter: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: LETTER_S, ease: "easeOut" },
  },
};

// `delay` (seconds) holds the whole cascade until the dots have finished assembling. `layoutId` lets the
// hero's <BrandIntroLockup> copy morph from this one, so the tagline glides down with the logo and stays
// on the page instead of fading out with the veil.
export function IntroWordmark({
  text,
  delay = 0,
  layoutId,
  className,
}: {
  text: string;
  delay?: number;
  layoutId?: string;
  className?: string;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: STAGGER_S, delayChildren: delay } },
  };

  return (
    <motion.div
      layoutId={layoutId}
      aria-label={text}
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "flex flex-wrap justify-center font-mono text-2xl font-semibold tracking-tight sm:text-3xl",
        className,
      )}
    >
      {[...text].map((char, i) =>
        // A newline becomes a zero-height, full-width flex item that pushes the rest onto the next row —
        // a hard break that keeps the global stagger sequence (it's just a non-animated child) intact.
        char === "\n" ? (
          <span key={i} className="basis-full" />
        ) : (
          <motion.span key={i} variants={letter} className="inline-block whitespace-pre">
            {char}
          </motion.span>
        ),
      )}
    </motion.div>
  );
}
