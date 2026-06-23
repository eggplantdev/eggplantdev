/* Agent: Claude — Cosmic Cartography / Content */

import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { HERO_COPY } from "@/data/hero-copy";

export function CosmicCartographyHeroContent() {
  const { subtitle, titleLine1, titleLine2, description } = HERO_COPY.cosmicCartography;
  return (
    <HeroContentWrapper
      above={
        <>
          <HeroSubtitle>{subtitle}</HeroSubtitle>
          <HeroEggplant floatMode="orbital" />
        </>
      }
    >
      <HeroTitle line1={titleLine1} line2={titleLine2} />
      <HeroDescription>{description}</HeroDescription>
    </HeroContentWrapper>
  );
}
