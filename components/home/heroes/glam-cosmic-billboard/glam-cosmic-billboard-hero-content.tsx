import { HeroDescription } from "@/components/home/heroes/hero-description";
import { HeroEggplant } from "@/components/home/heroes/hero-eggplant";
import { HeroSubtitle } from "@/components/home/heroes/hero-subtitle";
import { HeroTitle } from "@/components/home/heroes/hero-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HERO_COPY } from "@/data/hero-copy";

export function GlamCosmicBillboardHeroContent() {
  const { subtitle, titleLine1, titleLine2, description, buttons } = HERO_COPY.glamCosmicBillboard;
  return (
    <div className={`fest-container relative z-10`}>
      <div className="relative z-10 grid grid-cols-[1fr_auto] items-center md:justify-items-stretch">
        <div className="w-full">
          <HeroSubtitle className="text-hot-pink/40 mb-0 text-left">{subtitle}</HeroSubtitle>
          <HeroTitle line1={titleLine1} line2={titleLine2} className="mt-4 text-left" />
          <HeroDescription className="mt-12 mr-auto ml-0 px-0 text-left md:mt-12">{description}</HeroDescription>
        </div>

        <div className="relative mt-8 flex items-center justify-center">
          <HeroEggplant
            className="mt-0 mb-0 lg:mt-0 lg:mb-0"
            preset="glam-gold"
            glowPreset="gold"
            sizeClass="size-36 md:size-64 lg:size-72 xl:size-80"
          />
        </div>
      </div>
      {buttons && (
        <div className="mt-12 flex flex-wrap justify-start gap-4">
          <Button variant="heroHotPinkPrimary" size="hero" asChild>
            <Link href="#contact">{buttons[0]}</Link>
          </Button>
          <Button
            variant="heroHotPinkSecondary"
            size="hero"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {buttons[1]}
          </Button>
        </div>
      )}
    </div>
  );
}
