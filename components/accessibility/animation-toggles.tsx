"use client";

import { usePreferencesStore } from "@/stores/preferences-store";
import strings from "@/data/ui-copy.json";
import { ToggleSwitch } from "./toggle-switch";
import { cn } from "../../helpers/cn";

export function AnimationToggles({ className }: { className?: string }) {
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion);
  const setReduceMotion = usePreferencesStore((s) => s.setReduceMotion);
  const t = strings.accessibility;

  return (
    <div className={cn("grid grid-cols-1 gap-3 md:gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-16 md:text-14 truncate">{t.allAnimations}</span>
        <ToggleSwitch
          checked={!reduceMotion}
          onChange={(enabled) => setReduceMotion(!enabled)}
          label={t.allAnimations}
        />
      </div>
    </div>
  );
}
