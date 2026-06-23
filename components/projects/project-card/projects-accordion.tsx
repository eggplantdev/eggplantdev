"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ProjectT } from "@/types/projects-types";
import { RoundedSeparator } from "@/components/general/rounded-separator";
import { AccordionTrigger } from "@/components/projects/project-card/accordion-trigger";
import { AccordionContentPanel } from "@/components/projects/project-card/accordion-content";
import { getProjectNameFont } from "@/helpers/get-project-name-font";

type ProjectsAccordionPropsT = {
  projects: ProjectT[];
};

// TODO: Restore fixed-height measurement system to prevent layout shift / reflow.
// See git history for the implementation (measures offscreen panels, locks minHeight
// to worst-case expanded height). Temporarily removed to debug calculation issues.
export function ProjectsAccordion({ projects }: ProjectsAccordionPropsT) {
  // Empty string = all folded; `collapsible` lets the open item close back to this state.
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <Accordion.Root type="single" collapsible value={openItem} onValueChange={setOpenItem} className="flex flex-col">
      {projects.map((project) => (
        <ProjectAccordionItem key={project.uuid} project={project} isOpen={openItem === project.uuid} />
      ))}
      <RoundedSeparator className="transition-transform duration-300 group-hover/card:translate-y-[-6px]" />
    </Accordion.Root>
  );
}

type ProjectAccordionItemPropsT = {
  project: ProjectT;
  isOpen: boolean;
};

function ProjectAccordionItem({ project, isOpen }: ProjectAccordionItemPropsT) {
  const { name, description, sections, url } = project;

  const mainSection = sections?.find((s) => s.type === "main");
  const year = mainSection && "cats" in mainSection ? mainSection.cats.Year : undefined;
  const tags = getProjectTags(project);

  return (
    <Accordion.Item value={project.uuid} className="group/card">
      <RoundedSeparator className="transition-transform duration-300 group-hover/card:translate-y-[-6px]" />

      <AccordionTrigger
        name={name}
        year={year}
        isOpen={isOpen}
        hasUrl={!!url}
        nameFontClass={getProjectNameFont(project.slug)}
      />

      <AccordionContentPanel isOpen={isOpen} description={description} tags={tags} url={url} />
    </Accordion.Item>
  );
}

function getProjectTags(project: ProjectT): string[] {
  const techstack = project.sections?.find((s) => s.type === "techstack");
  return techstack && "tags" in techstack ? techstack.tags : [];
}
