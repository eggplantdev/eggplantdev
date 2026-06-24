"use client";

import { usePreferencesStore } from "@/stores/preferences-store";
import strings from "@/data/ui-copy.json";
import { ToggleSwitch } from "./toggle-switch";

export function ThemeToggle() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const t = strings.accessibility;

  const isContrast = theme === "contrast";

  const handleToggle = (toContrast: boolean) => {
    setTheme(toContrast ? "contrast" : "dark");
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-16 md:text-14 truncate">{t.toggleTheme}</span>
      <ToggleSwitch checked={isContrast} onChange={handleToggle} label={t.toggleTheme} />
    </div>
  );
}
