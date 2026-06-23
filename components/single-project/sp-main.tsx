import { ProjectT, ProjectSectionT } from "@/types/projects-types";
import { SpHeroSection } from "@/components/single-project/sp-hero-section";
import { SimpleSection } from "@/components/home/sections/simple-section";
import { Screens } from "@/components/single-project/sp-screens";
import { SpVideo } from "@/components/single-project/sp-video";
import { SpTechStack } from "@/components/single-project/sp-tech-stack";
import { SpTeam } from "@/components/single-project/sp-team";
import { QuoteSection } from "@/components/home/sections/quote-section";
import { cn } from "@/helpers/cn";

type SingleProjectMainPropsT = {
  project: ProjectT;
};

export const SingleProjectMain = ({ project }: SingleProjectMainPropsT) => {
  const { name, slug, sections } = project;

  return (
    <div className="max-w-xxl mx-auto pt-20 xl:pt-40">
      {sections.map((section, index) => (
        <section key={section.type + index} className={"border-gray2 border-b py-40 first:pt-0 last:border-0"}>
          <RenderProjectSection section={section} name={name} slug={slug} />
        </section>
      ))}
    </div>
  );
};

type RenderProjectSectionPropsT = {
  section: ProjectSectionT;
  name: string;
  slug: string;
};

const RenderProjectSection = ({ section, name, slug }: RenderProjectSectionPropsT) => {
  switch (section.type) {
    case "main":
      return <SpHeroSection name={name} slug={slug} mainSection={section} />;
    case "simple":
      return <SimpleSection titleLine={section.titleLine} text={section.text} className="fest-container" />;
    case "screenshots":
      return <Screens data={section} />;
    case "video":
      return <SpVideo data={section} />;
    case "techstack":
      return <SpTechStack data={section} />;
    case "team":
      return <SpTeam data={section} />;
    case "quote":
      return <QuoteSection data={section} singleProjectPage={true} className="fest-container" />;
  }
};
