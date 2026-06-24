import type { HeroCopyT } from "@/types/hero-copy-types";

export type HeroCopyKeyT =
  | "glamCosmicBillboard"
  | "soleilAubergine"
  | "metatronsCube"
  | "hexLatticeShrine"
  | "cosmicCultFlyer"
  | "cosmicFlower"
  | "notFound"
  | "error"
  | "cosmicCartography"
  | "gridOfLife";

export type HeroCopyMapT = Record<HeroCopyKeyT, HeroCopyT>;

export const HERO_COPY: HeroCopyMapT = {
  soleilAubergine: {
    subtitle: "Object #000 \nClassification: pending",
    titleLine1: "Space",
    titleLine2: "Oddity",
    description:
      "Less vegetable, more minor celestial authority. Warm, theatrical, impossible to ignore, and somehow still tasteful.",
  },

  metatronsCube: {
    subtitle: "Object #001",
    titleLine1: "The",
    titleLine2: "Blueprint",
    description:
      "Every serious system starts with structure. For reasons nobody can fully explain, this one also started with an eggplant.",
    buttons: ["Make contact", "Back to top"],
  },

  hexLatticeShrine: {
    eyebrow: "Object #002",
    titleLine1: "Peculiar",
    titleLine2: "Shrine",
    description:
      "At some point the layout stopped being a layout and became a shrine. The eggplant remained at the center, supervising alignment and other minor miracles.",
  },
  cosmicFlower: {
    subtitle: "Object #003",
    titleLine1: "Ritual",
    titleLine2: "Operator",
    description: "The singularity emerged. Word had to spread. Management wasn't prepared for the Eggplant.",
  },

  cosmicCultFlyer: {
    subtitle: "Object #004",
    titleLine1: "The",
    titleLine2: "Code",
    description: "Do not question the Eggplant. \nThe Eggplant is the question. \nIt works on my machine.",
  },

  glamCosmicBillboard: {
    subtitle: "Object #005 \nAGI ACHIEVED",
    titleLine1: "Final",
    titleLine2: "Echo",
    description: "Still out there, still orbiting. \nTransmission remains possible.",
    buttons: ["Make contact", "Back to top"],
  },

  notFound: {
    subtitle: "Cosmic Produce Network",
    titleLine1: "Not",
    titleLine2: "Found",
    description: "You drifted past the event horizon. Nothing left but a sacred singularity.",
    buttonPrimary: "Find Your Way Home",
  },
  error: {
    subtitle: "System anomaly detected",
    titleLine1: "Something",
    titleLine2: "Broke",
    description: "A glitch in the sacred geometry. The cosmic grid is recalibrating — try again in a moment.",
    buttonPrimary: "Try Again",
  },
  cosmicCartography: {
    subtitle: "Classified Spatial Index",
    titleLine1: "Cosmic",
    titleLine2: "Cartography",
    description:
      "The map is not the territory, but the territory has concentric rings and an aubergine at the origin. So the map is pretty close.",
  },
  gridOfLife: {
    subtitle: "Structural Inevitability",
    titleLine1: "Grid of",
    titleLine2: "Life",
    description:
      "Dense, interconnected, and unreasonably symmetrical. The kind of geometry that makes you suspect the universe has opinions about tessellation.",
  },
};
