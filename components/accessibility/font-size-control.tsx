"use client";

import { usePreferencesStore, MIN_SCALE, MAX_SCALE, FONT_STEP } from "@/stores/preferences-store";
import strings from "@/data/ui-copy.json";

function ScaleButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="text-28 md:text-20 text-primary flex cursor-pointer items-center justify-center rounded-full leading-none focus-visible:outline-white disabled:cursor-default disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function FontSizeControl() {
  const scale = usePreferencesStore((s) => s.scale);
  const setScale = usePreferencesStore((s) => s.setScale);
  const t = strings.accessibility;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-16 md:text-14 shrink-0" id="font-size-label">
        {t.fontSize}
      </span>
      <div className="flex items-center gap-2" role="group" aria-labelledby="font-size-label">
        <ScaleButton
          label={t.decreaseFontSize}
          onClick={() => setScale(scale - FONT_STEP)}
          disabled={scale <= MIN_SCALE}
        >
          −
        </ScaleButton>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={FONT_STEP}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          aria-label={t.fontSize}
          aria-valuemin={MIN_SCALE}
          aria-valuemax={MAX_SCALE}
          aria-valuenow={scale}
          aria-valuetext={`${Math.round(scale * 100)}%`}
          className="bg-gray5 h-2 w-24 cursor-pointer appearance-none rounded outline-none md:w-20 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-shadow focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,0.3)] md:[&::-webkit-slider-thumb]:h-4 md:[&::-webkit-slider-thumb]:w-4"
        />
        <ScaleButton
          label={t.increaseFontSize}
          onClick={() => setScale(scale + FONT_STEP)}
          disabled={scale >= MAX_SCALE}
        >
          +
        </ScaleButton>
      </div>
    </div>
  );
}
