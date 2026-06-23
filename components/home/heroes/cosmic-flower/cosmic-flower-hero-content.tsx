import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { Button } from "@/components/ui/button";
import { HERO_COPY } from "@/data/hero-copy";

export function CosmicFlowerHeroContent() {
  const { subtitle, titleLine1, titleLine2, description, buttons } = HERO_COPY.cosmicFlower;
  return (
    <HeroContentWrapper
      above={
        <>
          <HeroSubtitle>{subtitle}</HeroSubtitle>
          <HeroEggplant preset="warm-gold-glow" floatMode="orbital" />
        </>
      }
    >
      <HeroTitle line1={titleLine1} line2={titleLine2} />
      <HeroDescription>{description}</HeroDescription>
      {buttons && (
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="heroHotPinkPrimary" size="hero">
            {buttons[0]}
          </Button>
          <Button variant="heroHotPinkSecondary" size="hero">
            {buttons[1]}
          </Button>
        </div>
      )}
    </HeroContentWrapper>
  );
}
