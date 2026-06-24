"use client";

import { usePreferencesStore } from "@/stores/preferences-store";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

// Single source of truth for "should motion be suppressed?": the user's manual
// master toggle (persisted) OR the live OS prefers-reduced-motion setting.
// Use this to gate JS-driven motion (GSAP, Framer, SVG SMIL, timers) — CSS
// animations/transitions are killed declaratively in globals.css instead.
export function useReduceMotion() {
  const manual = usePreferencesStore((s) => s.reduceMotion);
  const os = usePrefersReducedMotion();
  return manual || os;
}
