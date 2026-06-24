"use client";

import { TravelingDots } from "@/components/animations/fixed-traveling-dots/traveling-dots";
import { OrbitDot } from "@/components/animations/orbit-dot/orbit-dot";
import { OrbitDotDefs } from "@/components/animations/orbit-dot/orbit-dot-defs";
import { EggplantImage } from "@/components/general/eggplant-image";
import {
  BILLBOARD_DOT_PATHS,
  GLAM_STRIPES,
  ID,
  ORBITAL_ARCS,
  ORBIT_PATH,
  ORBIT_PATH_PINK,
} from "./glam-billboard-config";

// Standalone decorative billboard that sits right before the contact footer. Fully self-contained: the
// section wrapper, subtitle, and eggplant markup all live inline here, so it can be tuned freely. Only the
// animation engines stay imported — EggplantImage (preload + yoyo float) and TravelingDots (SVG motion) —
// since those are infrastructure, not this section's styling.
//
// The cosmic <svg> is absolute inset-0, so its ring size tracks the section height — the grid's min-h
// keeps it tall enough that the rings read big even though the eggplant is small.
const SUBTITLE = "It's not a vegetable. \nIt's a berry. \nFull of real juice.";

export function GlamBillboard() {
  return (
    <div className="relative my-24 md:my-32">
      <div className="flex h-full flex-col">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid meet"
        >
          <OrbitDotDefs goldId={ID.orbitDot} pinkId={ID.orbitDotPink} />

          {/* Diagonal glam stripes — extended past the viewBox so they span the full section width */}
          {GLAM_STRIPES.map((stripe, i) => (
            <line
              key={`stripe-${i}`}
              x1={stripe.x1}
              y1={stripe.y1}
              x2={stripe.x2}
              y2={stripe.y2}
              stroke={stripe.stroke}
              strokeWidth={stripe.strokeWidth}
              opacity={stripe.opacity}
            />
          ))}

          {/* Orbital arcs — the rings */}
          {ORBITAL_ARCS.map((arc, i) => (
            <ellipse
              key={`arc-${i}`}
              cx={arc.cx}
              cy={arc.cy}
              rx={arc.rx}
              ry={arc.ry}
              fill="none"
              stroke={arc.stroke}
              strokeWidth={arc.strokeWidth}
              opacity={arc.opacity}
              transform={`rotate(${arc.rotate} ${arc.cx} ${arc.cy})`}
            />
          ))}

          <TravelingDots gradients={[]} paths={BILLBOARD_DOT_PATHS} />

          <OrbitDot path={ORBIT_PATH} gradientId={ID.orbitDot} />
          <OrbitDot path={ORBIT_PATH_PINK} gradientId={ID.orbitDotPink} durationS={38} delay={12} />
        </svg>

        {/* Subtitle (left) + floating eggplant (right). min-h keeps the section tall so the rings read big. */}
        <div className="fest-container relative z-10">
          {/* min-h drives the section height; the meet-fit svg scales the rings/lines with it, so min-h and
              max-w set the size of the whole composition. */}
          <div className="relative z-10 mx-auto grid min-h-84 max-w-md grid-cols-[1fr_auto] items-center lg:min-h-92 lg:max-w-xl xl:min-h-104">
            <p className="text-hot-pink/80 w-full text-left font-mono text-xs tracking-[0.2em] whitespace-pre-line uppercase lg:text-sm">
              {SUBTITLE}
            </p>

            <div className="relative z-10 flex w-full items-center justify-center">
              <EggplantImage
                preset="glam-gold"
                glowPreset="gold"
                sizeClass="size-28 sm:size-32 md:size-40 lg:size-48"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
