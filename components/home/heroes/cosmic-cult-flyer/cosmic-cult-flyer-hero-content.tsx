import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { Button } from "@/components/ui/button";
import { HERO_COPY } from "@/data/hero-copy";

export function CosmicCultFlyerHeroContent() {
  const { subtitle, titleLine1, titleLine2, description, buttonPrimary, buttonSecondary } = HERO_COPY.cosmicCultFlyer;
  return (
    <HeroContentWrapper
      above={
        <>
          <HeroSubtitle>{subtitle}</HeroSubtitle>
          <HeroEggplant floatMode="tumble" />
        </>
      }
    >
      <HeroTitle line1={titleLine1} line2={titleLine2} />
      <HeroDescription>{description}</HeroDescription>
      {buttonPrimary && buttonSecondary && (
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="heroHotPinkPrimary" size="hero">
            {buttonPrimary}
          </Button>
          <Button variant="heroHotPinkSecondary" size="hero">
            {buttonSecondary}
          </Button>
        </div>
      )}
    </HeroContentWrapper>
  );
}
