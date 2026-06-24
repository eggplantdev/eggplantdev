export type ProjectT = {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  category?: string;
  domains?: string[];
  url?: string;
  logo: string;
  tempSlug: string;
  sections: ProjectSectionT[];
};

export type ProjectSectionT =
  | ProjectMainSectionT
  | SimpleSectionT
  | ScreenshotsSectionT
  | VideoSectionT
  | TeamSectionT
  | ProjectQuoteSectionT
  | TechstackSectionT;

type ProjectMainSectionT = {
  type: "main";
  cats: { Client: string; Region: string; Year: string; Industry: string };
  slides: { mainFoto: string; desktopView: string; mobileView: string }[];
};

type SimpleSectionT = {
  type: "simple";
  titleLine: string[];
  text: string;
};

type ScreenshotsSectionT = {
  type: "screenshots";
  gridColumnsNumber: number;
  images: string[];
};

type VideoSectionT = {
  type: "video";
  desktopScreenshot: string;
  mobileScreenshot: string;
};

type TeamSectionT = {
  type: "team";
  title: string;
  cards: { title: string; content: string }[];
};

type ProjectQuoteSectionT = {
  type: "quote";
  titleLine: string[];
  quotes: { quote: string; name: string; title: string; avatar: string }[];
};

type TechstackSectionT = {
  type: "techstack";
  title: string;
  tags: string[];
};
