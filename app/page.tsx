"use client";

import { ProjectsSection } from "@/components/home/sections/projects-section";
import homeData from "@/data/home.en.json";
import type { HomePagePropsT, ProjectsSectionT, FullSectionT } from "@/types/home-page-types";
import { GradientMask } from "@/components/general/gradient-mask/gradient-mask";
import { AnimatedLettersMask } from "@/components/home/intro/animated-letters/animated-letters";
import { BrandIntroLockup } from "@/components/brand/brand-intro-lockup";
import { GlamBillboard } from "@/components/home/sections/glam-billboard/glam-billboard";
import { useScrollFadeOut } from "@/hooks/use-scroll-fade-out";
import Image from "next/image";

export default function HomePage() {
  const { introTxt, sections } = homeData as HomePagePropsT["data"];
  const heroRef = useScrollFadeOut();

  const commercialWork = sections[0] as ProjectsSectionT;
  const freelanceWork = sections[1] as ProjectsSectionT;

  return (
    <div className="bg-bgc text-primary">
      <GradientMask />
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1">
        {/* Centered hero — the brand mark scatters into place + tagline cascades; fills the viewport. */}
        <section ref={heroRef} className="flex min-h-svh items-center justify-center">
          <BrandIntroLockup />
        </section>

        <section className="fest-container fest-grid items-start gap-y-8 md:gap-y-16">
          <AnimatedLettersMask
            text={introTxt}
            className="640:col-span-8 col-span-full min-w-0 md:col-span-10 xl:col-span-14"
          />
          <div className="640:col-span-5 relative col-span-4 aspect-4/3 w-full overflow-hidden rounded-lg md:col-span-6 xl:col-span-9">
            <Image
              src="/images/ja_summer_bw.jpeg"
              alt="Black-and-white summer portrait"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1440px) 50vw, 664px"
              className="object-cover"
            />
          </div>
        </section>

        <ProjectsSection data={freelanceWork} />
        <ProjectsSection data={commercialWork} />

        <GlamBillboard />

        <GradientMask position="bottom" />
      </div>
    </div>
  );
}
