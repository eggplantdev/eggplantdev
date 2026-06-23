/* Agent: Claude — Grid of Life / Content */

import Link from "next/link";
import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { Button } from "@/components/ui/button";
import { HERO_COPY, type HeroCopyKeyT } from "@/data/hero-copy";

export function GridOfLifeHeroContent({ copyKey }: { copyKey?: HeroCopyKeyT }) {
  const { subtitle, titleLine1, titleLine2, description, buttonPrimary } = HERO_COPY[copyKey ?? "gridOfLife"];
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
      {buttonPrimary && (
        <div className="mt-8 flex justify-center">
          <Button variant="heroHotPinkSecondary" size="hero" asChild>
            <Link href="/">{buttonPrimary}</Link>
          </Button>
        </div>
      )}
    </HeroContentWrapper>
  );
}
