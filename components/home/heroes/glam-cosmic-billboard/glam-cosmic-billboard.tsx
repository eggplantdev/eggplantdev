"use client";

import { ORBIT_PATH, ORBIT_PATH_PINK, ORBITAL_ARCS, GLAM_STRIPES, BILLBOARD_DOT_PATHS, ID } from "./config";
import { TravelingDots } from "@/components/animations/fixed-traveling-dots/traveling-dots";
import { OrbitDot } from "@/components/animations/orbit-dot/orbit-dot";
import { OrbitDotDefs } from "@/components/animations/orbit-dot/orbit-dot-defs";
import { GlamCosmicBillboardNebulaWash } from "./glam-cosmic-billboard-nebula-wash";
import { GlamCosmicBillboardHeroContent } from "./glam-cosmic-billboard-hero-content";
import HeroSectionWrapper from "../../../animations/hero-section-wrapper/hero-section-wrapper";

export function GlamCosmicBillboard() {
  return (
    <HeroSectionWrapper>
      {/* Gold/pink radial gradient background — fades to transparent at top & bottom edges */}
      <GlamCosmicBillboardNebulaWash />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <OrbitDotDefs goldId={ID.orbitDot} pinkId={ID.orbitDotPink} />

        {/* Diagonal glam stripes */}
        {GLAM_STRIPES.map((stripe, i) => (
          <line
            key={`stripe-${i}`}
            x1="0"
            y1={stripe.y1}
            x2="1200"
            y2={stripe.y2}
            stroke={stripe.stroke}
            strokeWidth={stripe.strokeWidth}
            opacity={stripe.opacity}
          />
        ))}

        {/* Orbital arcs — billboard-specific */}
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

        {/* Traveling dots along diagonal stripes (gradients defined by FixedTravelingDots in layout) */}
        <TravelingDots gradients={[]} paths={BILLBOARD_DOT_PATHS} />

        {/* Orbiting dot — gold arc */}
        <OrbitDot path={ORBIT_PATH} gradientId={ID.orbitDot} />
        {/* Orbiting dot — pink arc */}
        <OrbitDot path={ORBIT_PATH_PINK} gradientId={ID.orbitDotPink} durationS={38} delay={12} />
      </svg>

      {/* Title, subtitle, description, CTA buttons, and floating eggplant image */}
      <GlamCosmicBillboardHeroContent />
    </HeroSectionWrapper>
  );
}
