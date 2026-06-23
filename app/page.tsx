"use client";

import { ProjectsSection } from "@/components/home/sections/projects-section";
import { FullSection } from "@/components/home/sections/full-section";
import { useLocalizedData } from "@/hooks/use-localized-data";
import type { ProjectsSectionT, FullSectionT } from "@/types/home-page-types";
import { GradientMask } from "@/components/general/gradient-mask/gradient-mask";
import { AnimatedLettersMask } from "@/components/home/intro/animated-letters/animated-letters";
import { BrandIntroLockup } from "@/components/brand/brand-intro-lockup";
import { HERO_MODE } from "@/components/brand/brand-intro-config";
import Image from "next/image";

export default function HomePage() {
  const { introTxt, sections } = useLocalizedData("home");

  const commercialWork = sections[0] as ProjectsSectionT;
  const freelanceWork = sections[1] as ProjectsSectionT;
  const about = sections[2] as FullSectionT;

  return (
    <div className="bg-bgc text-primary">
      <GradientMask />
      <div className="grid grid-cols-1 gap-y-32 py-32 md:gap-y-48">
        {/* Centered hero — the splash logo + tagline morph down into this lockup and stay. In the static
            test variant, fill the viewport and cancel the grid's top padding so the mark sits dead center. */}
        <section
          className={
            HERO_MODE === "static"
              ? "-mt-32 flex min-h-svh items-center justify-center"
              : "flex justify-center pt-16 md:pt-24"
          }
        >
          <BrandIntroLockup />
        </section>

        <section className="fest-container flex flex-col items-start gap-10 md:gap-12">
          <AnimatedLettersMask text={introTxt} className="min-w-0 flex-1" />
          <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg md:max-w-md">
            <Image
              src="/images/ja_summer_bw.jpeg"
              alt="Black-and-white summer portrait"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>
        <ProjectsSection data={commercialWork} className="fest-container" />

        <ProjectsSection data={freelanceWork} className="fest-container" />

        {/* Intro letters (moved down from the top) with the portrait stacked underneath. */}

        <FullSection data={about} className="fest-container" />

        {/* Spacing before footer */}
        <GradientMask position="bottom" />
      </div>
    </div>
  );
}
