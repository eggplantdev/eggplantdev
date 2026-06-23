"use client";

import { notFound } from "next/navigation";
import projectsData from "@/data/projects.en.json";
import type { ProjectT } from "@/types/projects-types";
import { SingleProjectMain } from "@/components/single-project/sp-main";

type SpPageClientPropsT = {
  slug: string;
};

export function SpPageClient({ slug }: SpPageClientPropsT) {
  const { projects } = projectsData as { projects: ProjectT[] };
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return <SingleProjectMain project={project} />;
}
