export type ProjectT = {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  category?: string;
  domains?: string[];
  url?: string;
  sections: ProjectSectionT[];
};

export type ProjectSectionT = ProjectMainSectionT | TechstackSectionT;

type ProjectMainSectionT = {
  type: "main";
  cats: { Year: string };
};

type TechstackSectionT = {
  type: "techstack";
  tags: string[];
};
