"use client";

// Animated variant of the brand mark: a dot grid where each dot flies in from a scattered position
// and settles into place. Geometry/colours come from the shared brand-mark-dots source — this file
// only owns the entrance animation.
//
// `entrance={false}` renders the mark already settled (no scatter, glow at rest).

import { useId } from "react";
import { motion } from "framer-motion";

import { cn } from "@/helpers/cn";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

import { buildBrandDots, DOT_R, VIEWBOX } from "./brand-mark-dots";
import { rand, scatter } from "./brand-mark-scatter";

const GLOW = 0.9; // 0..1 bloom intensity
const REST_BLUR = GLOW * DOT_R * 1.8; // resting glow blur
const FLIGHT_BLUR = REST_BLUR * 3.2; // bigger bloom while the dots are still flying in

// Each dot's flight geometry is index-hashed and prop-independent, so derive it once at module load
// rather than per render — every instance and every render share the same array.
const DOTS = buildBrandDots().map((d, i) => ({
  ...d,
  from: scatter(i, d.cx, d.cy),
  // Stagger by a hashed delay + a gentle index ramp so dots don't all land at once.
  delay: i * 0.03 + rand(i * 3 + 7) * 0.35,
}));

type AnimatedBrandLogoPropsT = {
  className?: string;
  // false → render settled, no entrance animation.
  entrance?: boolean;
};

export function AnimatedBrandLogo({ className, entrance = true }: AnimatedBrandLogoPropsT) {
  const reduced = useReduceMotion();
  // Unique per instance — a fixed id collides with a second copy of this logo on screen, and
  // url(#id) resolves to the first match.
  const filterId = useId();
  const animate = entrance && !reduced;

  // One layer of <motion.circle>s; rendered twice (blurred glow behind, sharp in front) with
  // identical motion props so both stay perfectly in sync through the flight.
  const renderDots = () =>
    DOTS.map((d) => (
      <motion.circle
        key={`${d.cx}-${d.cy}`}
        r={d.r}
        fill={d.fill}
        initial={animate ? { cx: d.from.x, cy: d.from.y, scale: 0.2, opacity: 0 } : false}
        animate={{ cx: d.cx, cy: d.cy, scale: 1, opacity: 1 }}
        transition={
          animate
            ? {
                // Softer spring (lower stiffness, more mass) — dots drift in and settle slowly.
                cx: { type: "spring", stiffness: 55, damping: 14, mass: 1.4, delay: d.delay },
                cy: { type: "spring", stiffness: 55, damping: 14, mass: 1.4, delay: d.delay },
                scale: { type: "spring", stiffness: 70, damping: 13, mass: 1.2, delay: d.delay },
                opacity: { duration: 0.6, delay: d.delay },
              }
            : { duration: 0 }
        }
      />
    ));

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      // overflow-visible: the glow blur (and the scatter cloud) bloom past the viewBox; the svg's
      // default overflow:hidden would clip them at the box edge.
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <motion.feGaussianBlur
            initial={animate ? { stdDeviation: FLIGHT_BLUR } : false}
            animate={{ stdDeviation: REST_BLUR }}
            transition={animate ? { duration: 2, ease: "easeOut" } : { duration: 0 }}
          />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} opacity={Math.min(1, 0.55 + GLOW * 0.45)}>
        {renderDots()}
      </g>
      <g>{renderDots()}</g>
    </svg>
  );
}
