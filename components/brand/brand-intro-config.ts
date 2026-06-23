import { WORDMARK } from "./brand-intro-context";
import { wordmarkDurationMs } from "./intro-wordmark";

// Timing + session config for the brand intro, shared between the state machine (brand-intro-store) and
// the rendering (brand-intro-provider). Kept in one place so the choreography can't drift between the
// timers that advance the phase and the durations Framer Motion animates with.

// The splash plays in sequence: dots scatter/assemble, THEN the tagline types out, THEN a beat to read
// it before the logo morphs up into the nav. Each stage is its own number so the reveal can't drift.
export const SCATTER_MS = 3000; // dots fly in and settle (≈ slowest dot's staggered spring)
const READ_MS = 700; // pause after the tagline finishes, before revealing the page
export const INTRO_MS = SCATTER_MS + wordmarkDurationMs(WORDMARK) + READ_MS;
// The logo glides to the nav while the veil stays opaque — content is hidden until it lands. A hair
// longer than the morph's own duration (1s) so it fully settles before the veil dissolves.
export const MORPH_MS = 1100;
// Veil dissolve — only AFTER the morph, so the page reveals once the animation is done, not during it.
export const VEIL_FADE_S = 0.9;
export const VEIL_FADE_MS = VEIL_FADE_S * 1000;

// One key for the whole tab session — sessionStorage clears on tab close.
export const SEEN_KEY = "eggplant-brand-intro-seen";

// Nav mark's dot-scatter entrance on the veil-less paths (idle before the decision, skip for returning /
// reduced-motion visitors). false → the nav mark always renders already settled. Flip to true to bring
// the entrance animation back.
export const NAV_LOGO_ANIMATED = false;

// --- TEST TOGGLE (temporary) ---------------------------------------------------------------------
// "morph"  — shipped behaviour: the splash veil plays, then the logo shrinks + travels into the hero
//            lockup (BrandIntroLockup), where it settles.
// "static" — skip the splash/veil/morph entirely; the full-size logo just scatters in place as a plain
//            hero section — no scale-down, no travel. The morph wiring stays intact so we can flip back.
export const HERO_MODE: "morph" | "static" = "static";

// Dev replays the splash on every load so it's actually iterable; prod keeps the once-per-tab-session
// gate. Reduced-motion still skips in both (accessibility isn't a dev convenience). Baked at build time
// so the inline no-flash script can branch on it too.
export const ALWAYS_PLAY = process.env.NODE_ENV !== "production";
