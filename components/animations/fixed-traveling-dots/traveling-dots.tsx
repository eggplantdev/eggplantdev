/* TravelingDots — reusable SVG component
   Renders animated dots that travel along straight-line paths.
   Fully configurable: pass your own gradients, paths, colors, and timing.

   Each dot:
   - Follows a straight line (x1,y1 → x2,y2)
   - Uses a radial gradient fill (soft glow, fades to transparent)
   - Has three synchronized animations: motion, opacity, and size
   - Pauses at the end of its path (65% travel, 35% idle)

   Usage:
     <svg viewBox="0 0 1200 800">
       <TravelingDots gradients={myGradients} paths={myPaths} />
     </svg>
*/

"use client";

import { useReduceMotion } from "@/hooks/use-reduce-motion";

/* ── Types ── */

export type DotGradientT = {
  id: string;
  stops: readonly { offset: string; color: string; opacity: number }[];
};

export type DotPathT = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  gradientId: string;
  dur: number;
  radius?: number; // peak glow radius — default 22 (cosmic highway mode: 15)
};

/* ── Component ── */

export function TravelingDots({
  gradients,
  paths,
}: {
  gradients: readonly DotGradientT[];
  paths: readonly DotPathT[];
}) {
  const reduceMotion = useReduceMotion();
  const totalDots = paths.length;

  // SMIL can't be killed by CSS, so drop the whole layer when motion is reduced. Gating here (not at
  // each call site) keeps every consumer — including the always-on ambient FixedTravelingDots — honest.
  if (reduceMotion) return null;

  return (
    <>
      {/* Radial gradients — soft glow that fades to transparent at edges */}
      <defs>
        {gradients.map((g) => (
          <radialGradient key={g.id} id={g.id} cx="50%" cy="50%" r="50%">
            {g.stops.map((s, si) => (
              <stop key={si} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
            ))}
          </radialGradient>
        ))}
      </defs>

      {/* One <circle> per dot path, each with three synchronized animations */}
      {paths.map((dot, i) => {
        const motionPath = `M ${dot.x1} ${dot.y1} L ${dot.x2} ${dot.y2}`;
        /* Stagger start times evenly so dots don't all begin at once */
        const delay = (i / totalDots) * dot.dur;
        /* Scale glow radius per-dot for size variety */
        const peak = dot.radius ?? 22;
        /* Cosmic highway mode: change default above to 15 for smaller dots */
        const s = peak / 22;
        const rValues = `${Math.round(8 * s)};${peak};${Math.round(18 * s)};${Math.round(14 * s)};${Math.round(10 * s)};${Math.round(8 * s)};${Math.round(8 * s)}`;
        return (
          <circle key={i} r={Math.round(8 * s)} fill={`url(#${dot.gradientId})`}>
            {/* 1. Motion — slide along the path, then idle at the end
                   keyPoints 0→1 over 65% of the cycle, hold at 1 for the remaining 35% */}
            <animateMotion
              dur={`${dot.dur}s`}
              repeatCount="indefinite"
              path={motionPath}
              begin={`${delay}s`}
              keyPoints="0;1;1"
              keyTimes="0;0.65;1"
              /* Cosmic highway mode: use "0;0.5;1" for 50/50 travel/idle (lower frequency) */
              calcMode="linear"
            />
            {/* 2. Opacity — quick fade-in, slow fade-out, invisible during idle pause */}
            <animate
              attributeName="opacity"
              values="0;1;0.7;0.5;0.3;0;0"
              keyTimes="0;0.02;0.2;0.45;0.6;0.65;1"
              /* Cosmic highway mode: "0;0.02;0.15;0.35;0.45;0.5;1" */
              dur={`${dot.dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            {/* 3. Size — grows on appear, gradually shrinks as it fades out */}
            <animate
              attributeName="r"
              values={rValues}
              keyTimes="0;0.02;0.2;0.45;0.6;0.65;1"
              /* Cosmic highway mode: "0;0.02;0.15;0.35;0.45;0.5;1" */
              dur={`${dot.dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </>
  );
}
