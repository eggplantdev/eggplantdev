"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferences-store";

// Loads persisted preferences (theme, scale, animations) from localStorage after mount.
// Kept in an effect — never during render — so the first client render matches the server HTML and
// hydration stays clean. See the DEFAULTS note in preferences-store for the full rationale.
export function PreferencesHydrator() {
  const hydrate = usePreferencesStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
