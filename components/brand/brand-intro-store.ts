"use client";

import { useSyncExternalStore } from "react";

import { ALWAYS_PLAY, INTRO_DONE_MS, SEEN_KEY } from "./brand-intro-config";

// The brand intro's single piece of shared state: has the hero intro finished playing, so the nav
// (logo + chrome) may fade in? It lives OUTSIDE React — a tiny store advanced by one timer and read via
// useSyncExternalStore — so the decision never rides React's "setState in a mount effect → cascading
// render" path. Both the nav logo and the nav chrome subscribe to the one timeline.
let done = false;
let started = false;
const listeners = new Set<() => void>();

function finish() {
  done = true;
  for (const notify of listeners) notify();
}

// Reduced-motion and session state aren't knowable during SSR, so the timer can only start on the
// client — kicked off the first time a consumer subscribes (post-hydration). The `started` guard makes
// it idempotent: Strict Mode's double subscribe and a second consumer both reuse the one timeline.
function start() {
  if (started) return;
  started = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) != null;
  } catch {
    // sessionStorage throws in some privacy modes — failing open = the intro plays.
  }

  // Reduced-motion and returning-this-session visitors get the nav immediately, with no wait.
  if (reduced || (!ALWAYS_PLAY && seen)) {
    finish();
    return;
  }

  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // ignore: see above
  }

  // No clearTimeout: the subscribers are root-level singletons that mount once per load, and the
  // `started` guard already makes this run exactly once.
  window.setTimeout(finish, INTRO_DONE_MS);
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  start();
  return () => {
    listeners.delete(onChange);
  };
}

// SSR + first client (hydration) render resolve to false so the markup matches; the post-hydration
// subscribe runs start(), which flips us to done — immediately on the skip paths, else after the timer.
const getSnapshot = () => done;
const getServerSnapshot = () => false;

export function useIntroDone() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
