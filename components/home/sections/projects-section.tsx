"use client";

import { cn } from "@/helpers/cn";
import { ProjectsAccordion } from "@/components/projects/project-card/projects-accordion";
import { SimpleSection } from "@/components/home/sections/simple-section";
import { ProjectsSectionT } from "@/types/home-page-types";
import projectsData from "@/data/projects.en.json";
import type { ProjectT } from "@/types/projects-types";

type ProjectsSectionPropsT = {
  data: ProjectsSectionT;
  className?: string;
};

export const ProjectsSection = ({ data, className }: ProjectsSectionPropsT) => {
  const { projects } = projectsData as { projects: ProjectT[] };

  const filtered = data.filterCategory ? projects.filter((p) => p.category === data.filterCategory) : projects;

  return (
    <section id={data.id} className={cn("fest-grid scroll-mt-32", className)}>
      <SimpleSection titleLine={data.titleLine} text={data.text} className="col-span-full" />

      <div className="640:col-span-7 col-span-full pt-20 md:col-span-8">
        <ProjectsAccordion projects={filtered} />
      </div>
    </section>
  );
};
