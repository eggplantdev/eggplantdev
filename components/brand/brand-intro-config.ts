import { wordmarkDurationMs } from "./intro-wordmark";

// The tagline shown under the brand mark on the hero, and the anchor the nav-reveal timing derives
// from. The `\n` forces a fixed two-line break ("Websites and apps" / "for taste seekers") so the
// letter cascade wraps the same way regardless of viewport width.
export const WORDMARK = "Websites and apps\nfor taste seekers";

// Hero intro choreography (brand-intro-lockup): the dot mark scatters into place, THEN the tagline
// cascades in letter-by-letter, THEN a beat before the nav (logo + chrome) fades in. Each stage is its
// own number so the nav-reveal timing can't drift from what the lockup actually animates.
export const SCATTER_MS = 3000; // dots fly in and settle (≈ slowest dot's staggered spring)

// The tagline cascade overlaps the scatter tail instead of waiting for it to fully finish — the last
// dots are still settling as the first letters fade in. Starting at 60% of the scatter removes ~1.2s
// of dead air before the largest letter paints (mobile LCP was gated on the full 3s hold).
export const WORDMARK_DELAY_MS = SCATTER_MS * 0.6;

// The moment the hero intro is "done" — when the nav fades in (see brand-intro-store).
export const INTRO_DONE_MS = WORDMARK_DELAY_MS + wordmarkDurationMs(WORDMARK);

// One key for the whole tab session — sessionStorage clears on tab close, so a fresh tab/incognito
// reveals the nav on the full timeline again.
export const SEEN_KEY = "eggplant-brand-intro-seen";

// Dev waits out the full intro on every load so the timing is iterable; prod reveals the nav
// immediately on a repeat visit this session. Reduced-motion reveals immediately in both.
export const ALWAYS_PLAY = process.env.NODE_ENV !== "production";
