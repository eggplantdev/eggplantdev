"use client";

import { cn } from "@/helpers/cn";

type ToggleSwitchPropsT = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
};

export function ToggleSwitch({ checked, onChange, label, disabled }: ToggleSwitchPropsT) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      data-checked={checked || undefined}
      className={cn(
        "ml-8 flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full px-0.5 transition-colors duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-40 md:ml-4 md:h-6 md:w-10",
        checked ? "bg-green-toggle" : "bg-white/25",
      )}
    >
      <div
        className={cn(
          "h-7 w-7 rounded-full shadow-sm transition-[transform,background-color] duration-300 ease-out md:h-5 md:w-5",
          // The moving circle carries the gold accent when on; white when off.
          checked ? "bg-gold-cream translate-x-6 md:translate-x-4" : "translate-x-0 bg-white",
        )}
      />
    </button>
  );
}
