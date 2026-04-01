import { HeroContentWrapper } from "@/components/home/heroes/hero-content-wrapper";
import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { useLocalizedHeroCopy } from "@/hooks/use-localized-hero-copy";
import { EGGPLANT_PRESETS, type ThemeT } from "./config";

export function MetatronsCubeHeroContent({ theme }: { theme: ThemeT }) {
  const { subtitle, titleLine1, titleLine2, description } = useLocalizedHeroCopy("metatronsCube");
  return (
    <HeroContentWrapper
      above={
        <>
          <HeroSubtitle>{subtitle}</HeroSubtitle>
          <HeroEggplant preset={EGGPLANT_PRESETS[theme]} floatMode="jelly" />
        </>
      }
    >
      <HeroTitle line1={titleLine1} line2={titleLine2} />
      <HeroDescription>{description}</HeroDescription>
    </HeroContentWrapper>
  );
}
