import { create } from "zustand";

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
  scale: number;
  letterAnimations: boolean;
};

type PreferencesStoreT = PersistedT & {
  setTheme: (theme: ThemeT) => void;
  setScale: (scale: number) => void;
  setAnimation: (key: AnimationKeyT, enabled: boolean) => void;
  // Load persisted prefs after mount. MUST run only on the client (in an effect),
  // never during render — see DEFAULTS below for why.
  hydrate: () => void;
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
// Deterministic defaults — identical on the server and on the client's FIRST render.
// The store must NOT read localStorage or matchMedia at module load: that would make the
// client's first render differ from the server HTML (persisted theme vs default),
// which is exactly the hydration mismatch this replaces. Persisted values are applied
// later by hydrate(), called from a client effect after mount.
const DEFAULTS: PersistedT = {
  theme: "dark",
  scale: MIN_SCALE,
  letterAnimations: true,
};

// ── Apply side effects (theme, font-scale) ─────────────────
function applyTheme(theme: ThemeT) {
  document.documentElement.setAttribute("data-theme", theme);
}

function applyScale(scale: number) {
  document.documentElement.style.setProperty("--font-scale", String(scale));
}

// ── Store ──────────────────────────────────────────────────
function getPersistedSlice(state: PreferencesStoreT): PersistedT {
  return {
    theme: state.theme,
    scale: state.scale,
    letterAnimations: state.letterAnimations,
  };
}

export const usePreferencesStore = create<PreferencesStoreT>()((set, get) => ({
  ...DEFAULTS,

  hydrate: () => {
    const saved = getPersisted();
    const next: PersistedT = saved ?? { ...DEFAULTS, letterAnimations: !detectReducedMotion() };
    applyTheme(next.theme);
    applyScale(next.scale);
    set(next);
    if (!saved) persist(next);
  },

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
}));

export { ANIMATION_KEYS, THEMES, MIN_SCALE, MAX_SCALE, FONT_STEP };
export type { AnimationKeyT, ThemeT };
