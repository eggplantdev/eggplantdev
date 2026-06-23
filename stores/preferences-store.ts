import { create } from "zustand";
import type { LocaleT } from "@/lib/i18n/types";

// ── Constants ──────────────────────────────────────────────
const STORAGE_KEY = "preferences";
const ANIMATION_KEYS = ["letterAnimations"] as const;
const THEMES = ["dark", "contrast"] as const;
const MIN_SCALE = 1;
const MAX_SCALE = 1.5;
const FONT_STEP = 0.05;

// ── Types ──────────────────────────────────────────────────
type AnimationKeyT = (typeof ANIMATION_KEYS)[number];
type ThemeT = (typeof THEMES)[number];

type PersistedT = {
  theme: ThemeT;
  locale: LocaleT;
  scale: number;
  letterAnimations: boolean;
};

type PreferencesStoreT = PersistedT & {
  setTheme: (theme: ThemeT) => void;
  setScale: (scale: number) => void;
  setAnimation: (key: AnimationKeyT, enabled: boolean) => void;
  setLocale: (locale: LocaleT) => void;
};

// ── Detection ──────────────────────────────────────────────
function detectReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ── Persistence ────────────────────────────────────────────
function persist(state: PersistedT) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getPersisted(): PersistedT | undefined {
  if (typeof localStorage === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted — fall through
  }
}

// ── Initial state ──────────────────────────────────────────
function getInitialState(): PersistedT {
  const saved = getPersisted();
  if (saved) return saved;

  const reducedMotion = detectReducedMotion();

  const defaults: PersistedT = {
    theme: "dark",
    locale: "en",
    scale: MIN_SCALE,
    letterAnimations: !reducedMotion,
  };

  persist(defaults);
  return defaults;
}

// ── Apply side effects (theme, font-scale, lang) ───────────
function applyTheme(theme: ThemeT) {
  document.documentElement.setAttribute("data-theme", theme);
}

function applyScale(scale: number) {
  document.documentElement.style.setProperty("--font-scale", String(scale));
}

function applyLocale(locale: LocaleT) {
  document.documentElement.lang = locale;
}

// ── Store ──────────────────────────────────────────────────
const initial = getInitialState();

// Apply side effects at module load (safety net — inline script handles first paint)
if (typeof document !== "undefined") {
  applyTheme(initial.theme);
  applyScale(initial.scale);
  applyLocale(initial.locale);
}

function getPersistedSlice(state: PreferencesStoreT): PersistedT {
  return {
    theme: state.theme,
    locale: state.locale,
    scale: state.scale,
    letterAnimations: state.letterAnimations,
  };
}

export const usePreferencesStore = create<PreferencesStoreT>()((set, get) => ({
  ...initial,

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
    persist(getPersistedSlice({ ...get(), theme }));
  },

  setScale: (scale) => {
    const clamped = Math.round(Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale)) * 100) / 100;
    applyScale(clamped);
    set({ scale: clamped });
    persist(getPersistedSlice({ ...get(), scale: clamped }));
  },

  setAnimation: (key, enabled) => {
    set({ [key]: enabled });
    persist(getPersistedSlice({ ...get(), [key]: enabled }));
  },

  setLocale: (locale) => {
    applyLocale(locale);
    set({ locale });
    persist(getPersistedSlice({ ...get(), locale }));
  },
}));

export { ANIMATION_KEYS, THEMES, MIN_SCALE, MAX_SCALE, FONT_STEP };
export type { AnimationKeyT, ThemeT, LocaleT };
