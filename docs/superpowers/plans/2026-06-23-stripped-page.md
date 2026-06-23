# Stripped-down Home Page Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get the home page working clean — remove the Lenis smooth-scroll system, drop the experimental eggplant heroes from the page body, and replace the nav logo with the animated eggplant brand mark ported from `10x_devs`.

**Architecture:** Three independent changes. Removal work is verified by typecheck + dev build (no unit logic to TDD). The brand-mark port reuses existing `framer-motion` + `cn`.

**Tech Stack:** Next.js App Router, React, Tailwind v4, Zustand, framer-motion. Removing: `lenis`.

## Global Constraints

- Nothing is deleted from the repo except `components/general/smooth-scroll.tsx` (the Lenis wrapper) and the `lenis` dependency. All hero components stay in place.
- Native CSS `scroll-smooth` and the logo's `scrollTo({ behavior: "smooth" })` stay.
- No barrel/index exports — import component files directly.
- Stage by explicit path; commit messages chosen by the agent.

---

### Task 1: Port the animated brand mark

**Files:**

- Create: `components/brand/brand-mark-dots.ts` (port of `10x_devs/src/components/brand/brand-mark-dots.ts`, unchanged)
- Create: `components/brand/animated-brand-logo.tsx` (port of `10x_devs/src/components/brand/animated-brand-logo.tsx`, import fix only)

**Interfaces:**

- Produces: `AnimatedBrandLogo({ className?, entrance? })` from `@/components/brand/animated-brand-logo`; `buildBrandDots`, `scatter`, `rand`, `DOT_R`, `VIEWBOX` from `@/components/brand/brand-mark-dots`.

- [ ] Step 1: Copy `brand-mark-dots.ts` verbatim into `components/brand/`.
- [ ] Step 2: Copy `animated-brand-logo.tsx` into `components/brand/`; change `import { cn } from '@/lib/utils'` → `import { cn } from "@/helpers/cn"`. Keep all geometry imports pointing at `./brand-mark-dots`.
- [ ] Step 3: `npx tsc --noEmit` — expect no new errors from these files.
- [ ] Step 4: Commit (`components/brand/`).

### Task 2: Swap the nav logo to the animated brand mark

**Files:**

- Modify: `components/top-navigation/eggplant-logo.tsx`

**Interfaces:**

- Consumes: `AnimatedBrandLogo` from Task 1.
- Produces: unchanged `EggplantLogo({ className?, link? })` export (consumer `top-navigation.tsx` untouched).

- [ ] Step 1: Replace inner `EggplantImage` with `<AnimatedBrandLogo className={cn("size-10 sm:size-20 lg:size-32", className)} />`. Remove the `useGSAP`/`gsap`/`useRef` fade-in block and the `EggplantImage` import. Keep `Link href="/"` + the scroll-to-top `onClick`.
- [ ] Step 2: `npx tsc --noEmit` — no new errors.
- [ ] Step 3: Commit.

### Task 3: Drop eggplant heroes from the page body

**Files:**

- Modify: `app/page.tsx`

- [ ] Step 1: Remove the hero elements (`EggplantSun`, `MetatronsCube`, `HexLatticeShrineGold`, `CosmicFlower`, `CosmicCultFlyer`, `GlamCosmicBillboard`) and the `SacredSeparator` import. Keep `GradientMask`, `AnimatedLettersMask`, both `ProjectsSection`s, both `FullSection`s. Remove now-unused imports.
- [ ] Step 2: `npx tsc --noEmit` — no unused-import / missing-symbol errors.
- [ ] Step 3: Commit.

### Task 4: Remove the Lenis smooth-scroll system

**Files:**

- Delete: `components/general/smooth-scroll.tsx`
- Modify: `app/layout.tsx`, `stores/preferences-store.ts`, `components/accessibility/animation-toggles.tsx`, `lib/i18n/locales/en.json`, `lib/i18n/locales/pl.json`, `package.json`

- [ ] Step 1: `app/layout.tsx` — remove `SmoothScroll` import + wrapper; render `<main>` and `<Footer>` directly. Keep `scroll-smooth` classes.
- [ ] Step 2: `stores/preferences-store.ts` — remove `smoothScroll` from `ANIMATION_KEYS`, `PersistedT`, `defaults`, `getPersistedSlice`; remove `detectDesktopSafari` + `isDesktopSafari` field.
- [ ] Step 3: `components/accessibility/animation-toggles.tsx` — remove the `smoothScroll` selector and its `values` entry.
- [ ] Step 4: Remove the `smoothScroll` key from `en.json` and `pl.json` (accessibility namespace).
- [ ] Step 5: Delete `components/general/smooth-scroll.tsx`.
- [ ] Step 6: Remove `lenis` from `package.json` and run `npm uninstall lenis`.
- [ ] Step 7: `npx tsc --noEmit` + `npm run build` (or dev boot) — clean.
- [ ] Step 8: Commit.
