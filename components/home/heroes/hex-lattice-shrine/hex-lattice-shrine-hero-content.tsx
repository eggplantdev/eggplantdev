import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { HERO_COPY } from "@/data/hero-copy";

export function HexLatticeShrineHeroContent() {
  const { eyebrow, titleLine1, titleLine2, description } = HERO_COPY.hexLatticeShrine;
  return (
    <HeroContentWrapper
      above={
        <>
          <HeroSubtitle>{eyebrow}</HeroSubtitle>
          <HeroEggplant preset="warm-gold-sepia" floatMode="jelly" />
        </>
      }
    >
      <HeroTitle line1={titleLine1} line2={titleLine2} />
      <HeroDescription>{description}</HeroDescription>
    </HeroContentWrapper>
  );
}
