"use client";

import Link from "next/link";
import { CustomImgServer } from "@/components/general/custom-image/custom-img-server";
import { SpTitle } from "@/components/single-project/sp-title";
import strings from "@/data/ui-copy.json";

type SpHeroSectionPropsT = {
  name: string;
  slug: string;
  mainSection?: {
    type: "main";
    cats: { Client: string; Region: string; Year: string; Industry: string };
    slides: { mainFoto: string; desktopView: string; mobileView: string }[];
  };
};

export const SpHeroSection = ({ name, slug, mainSection }: SpHeroSectionPropsT) => {
  const firstSlide = mainSection?.slides[0];
  const cats = mainSection?.cats;
  const t = strings.nav;

  return (
    <div className="fest-container">
      <div className="">
        <div className="group text-16 mb-1 flex items-center space-x-4">
          <Link href="/">
            <span className="text-copy-body group-hover:text-copy-strong duration-500">{t.projects}</span>
          </Link>
        </div>
        <SpTitle name={name} slug={slug} />
      </div>

      {firstSlide && (
        <div className="mt-8 h-[70svh] max-h-[900px] min-h-[400px] md:mt-12 lg:mt-16 xl:mt-20">
          <div className="relative h-full w-full overflow-hidden rounded-3xl">
            <CustomImgServer
              src={firstSlide.mainFoto}
              alt={name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      )}

      {cats && (
        <div className="fest-container">
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 md:mt-12 md:gap-x-12 lg:mt-16">
            {Object.entries(cats).map(([label, value]) => (
              <div key={label}>
                <p className="text-16 text-copy-muted uppercase">{label}</p>
                <p className="text-16 text-copy-body md:text-20 pt-2">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
