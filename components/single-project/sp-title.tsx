"use client";

import { ScrambleText } from "@/components/general/scramble-text";
import { cn } from "@/helpers/cn";
import { getProjectNameFont } from "@/helpers/get-project-name-font";

type SpTitlePropsT = {
  name: string;
  slug: string;
};

export const SpTitle = ({ name, slug }: SpTitlePropsT) => {
  return (
    <h1
      className={cn(
        "text-40 sm:text-48 md:text-64 lg:text-80 xl:text-96 break-words uppercase",
        getProjectNameFont(slug),
      )}
    >
      <ScrambleText text={name} triggerOnMount />
    </h1>
  );
};
