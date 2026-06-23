import { wordmarkDurationMs } from "./intro-wordmark";

// The tagline shown under the brand mark on the hero, and the anchor the nav-reveal timing derives
// from. The `\n` forces a fixed two-line break ("Websites and apps" / "for taste seekers") so the
// letter cascade wraps the same way regardless of viewport width.
export const WORDMARK = "Websites and apps\nfor taste seekers";

// Hero intro choreography (brand-intro-lockup): the dot mark scatters into place, THEN the tagline
// cascades in letter-by-letter, THEN a beat before the nav (logo + chrome) fades in. Each stage is its
// own number so the nav-reveal timing can't drift from what the lockup actually animates.
export const SCATTER_MS = 3000; // dots fly in and settle (≈ slowest dot's staggered spring)
const REVEAL_PAUSE_MS = 1800; // beat after the tagline finishes, before the nav appears

// The moment the hero intro is "done" — when the nav fades in (see brand-intro-store).
export const INTRO_DONE_MS = SCATTER_MS + wordmarkDurationMs(WORDMARK) + REVEAL_PAUSE_MS;

// One key for the whole tab session — sessionStorage clears on tab close, so a fresh tab/incognito
// reveals the nav on the full timeline again.
export const SEEN_KEY = "eggplant-brand-intro-seen";

// Dev waits out the full intro on every load so the timing is iterable; prod reveals the nav
// immediately on a repeat visit this session. Reduced-motion reveals immediately in both.
export const ALWAYS_PLAY = process.env.NODE_ENV !== "production";
