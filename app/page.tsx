"use client";

import { ProjectsSection } from "@/components/home/sections/projects-section";
import { FullSection } from "@/components/home/sections/full-section";
import { useLocalizedData } from "@/hooks/use-localized-data";
import type { ProjectsSectionT, FullSectionT } from "@/types/home-page-types";
import { GradientMask } from "@/components/general/gradient-mask/gradient-mask";
import { AnimatedLettersMask } from "@/components/home/intro/animated-letters/animated-letters";

export default function HomePage() {
  const { introTxt, sections } = useLocalizedData("home");

  const commercialWork = sections[0] as ProjectsSectionT;
  const freelanceWork = sections[1] as ProjectsSectionT;
  const about = sections[2] as FullSectionT;
  const values = sections[3] as FullSectionT;

  return (
    <div className="bg-bgc text-primary">
      <GradientMask />
      <div className="grid grid-cols-1">
        <AnimatedLettersMask text={introTxt} />

        <ProjectsSection data={commercialWork} className="fest-container" />

        <ProjectsSection data={freelanceWork} className="fest-container" />

        <FullSection data={about} className="fest-container" />

        <FullSection data={values} className="fest-container" />

        {/* Spacing before footer */}
        <GradientMask position="bottom" />
      </div>
    </div>
  );
}
