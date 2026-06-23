/* Agent: Claude — Soleil Aubergine / Central Text + Eggplant Image */

import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { HERO_COPY } from "@/data/hero-copy";

export function EggplantSunHeroContent() {
  const { subtitle, titleLine1, titleLine2, description } = HERO_COPY.soleilAubergine;
  return (
    <HeroContentWrapper
      above={
        <>
          <HeroSubtitle className={`text-hot-pink/40`}>{subtitle}</HeroSubtitle>
          <HeroEggplant floatMode="orbital" />
        </>
      }
    >
      <HeroTitle line1={titleLine1} line2={titleLine2} />
      <HeroDescription>{description}</HeroDescription>
    </HeroContentWrapper>
  );
}
