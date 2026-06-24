"use client";

import { useReduceMotion } from "@/hooks/use-reduce-motion";

// A single dot orbiting a ring via SMIL motion. Shared animation infrastructure (like TravelingDots) —
// the glam-billboard section and the glam-cosmic-billboard hero both render these over their own
// configs, passing the gradient id and timing that suit each.
export function OrbitDot({
  path,
  gradientId,
  durationS = 44,
  delay = 0,
}: {
  path: string;
  gradientId: string;
  durationS?: number;
  delay?: number;
}) {
  const reduceMotion = useReduceMotion();

  return (
    <g>
      <circle r="10" fill={`url(#${gradientId})`} opacity="0.9">
        {/* SMIL animations can't be killed by CSS, so drop them entirely when motion is reduced. */}
        {!reduceMotion && (
          <>
            <animateMotion
              dur={`${durationS}s`}
              repeatCount="indefinite"
              path={path}
              rotate="auto"
              begin={`${delay}s`}
            />
            <animate
              attributeName="r"
              values="8;12;9;11;8"
              keyTimes="0;0.25;0.5;0.75;1"
              dur="6s"
              repeatCount="indefinite"
            />
          </>
        )}
      </circle>
    </g>
  );
}
