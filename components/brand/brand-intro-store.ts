import { type BrandIntroPhaseT } from "./brand-intro-context";
import { ALWAYS_PLAY, INTRO_MS, MORPH_MS, SEEN_KEY, VEIL_FADE_MS } from "./brand-intro-config";

// The intro is its own state machine living OUTSIDE React, advanced by timers and read via
// useSyncExternalStore. Modeling it as an external store (rather than render 'idle' → setState the real
// phase in a mount effect) is what keeps the decision off React's "setState synchronously in an effect →
// cascading render" path: React never sets state here, it just subscribes and re-reads on notify.
let phase: BrandIntroPhaseT = "idle";
let started = false;
const listeners = new Set<() => void>();

function set(next: BrandIntroPhaseT) {
  phase = next;
  for (const notify of listeners) notify();
}

// Reduced-motion and session state aren't knowable during SSR, so the timeline can only start on the
// client — kicked off the first time a consumer subscribes (post-hydration). The `started` guard makes
// it idempotent: Strict Mode's double subscribe/unsubscribe and any second consumer both reuse the one
// timeline instead of spawning a second set of timers.
function start() {
  if (started) return;
  started = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Once per tab session (sessionStorage clears on tab close → fresh tab/incognito replays).
  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) != null;
  } catch {
    // sessionStorage throws in some privacy modes — failing open = intro plays.
  }

  if (reduced || (!ALWAYS_PLAY && seen)) {
    set("skip");
    return;
  }

  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // ignore: see above
  }

  // splash → morph (veil still opaque) → reveal (veil dissolves) → done (cleanup). No clearTimeout: the
  // provider is a root-level singleton that mounts once per page load, so the timeline never needs to be
  // torn down — the `started` guard already makes it run exactly once.
  set("splash");
  window.setTimeout(() => set("morph"), INTRO_MS);
  window.setTimeout(() => set("reveal"), INTRO_MS + MORPH_MS);
  window.setTimeout(() => set("done"), INTRO_MS + MORPH_MS + VEIL_FADE_MS);
}

export function subscribeBrandIntro(onChange: () => void) {
  listeners.add(onChange);
  start();
  return () => {
    listeners.delete(onChange);
  };
}

export const getBrandIntroPhase = () => phase;
// SSR + first client (hydration) render resolve to 'idle' so the markup matches; the post-hydration
// subscribe runs start(), which notifies and flips us to splash/skip.
export const getBrandIntroServerPhase = (): BrandIntroPhaseT => "idle";
