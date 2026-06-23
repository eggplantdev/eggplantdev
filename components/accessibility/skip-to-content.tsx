"use client";

import strings from "@/data/ui-copy.json";

export function SkipToContent() {
  const t = strings.accessibility;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-999999 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      suppressHydrationWarning
    >
      {t.skipToContent}
    </a>
  );
}
