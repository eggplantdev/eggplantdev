# Stripped-down home page — design

Date: 2026-06-23
Branch: `animations_tests`

## Goal

Get the home page into a clean, working state. Three independent changes:
remove the Lenis smooth-scroll system, drop the experimental eggplant heroes
from the page body, and replace the nav logo with the animated eggplant brand
mark ported from the `10x_devs` repo.

**Nothing is deleted from the repo.** The experimental hero components stay in
`components/home/heroes/`; they are simply no longer referenced by `app/page.tsx`.

## Change 1 — Remove the Lenis smooth-scroll system (permanent)

Native CSS `scroll-smooth` and the logo's `window.scrollTo({ behavior: "smooth" })`
**stay**. Only the Lenis layer is removed.

- **Delete** `components/general/smooth-scroll.tsx`.
- `app/layout.tsx` — remove the `SmoothScroll` import and wrapper; render
  `<main>` + `<Footer>` directly. Keep the `scroll-smooth` classes on `<html>`/`<body>`.
- `stores/preferences-store.ts`:
  - Remove `smoothScroll` from `ANIMATION_KEYS`, `PersistedT`, the `defaults`
    object, and `getPersistedSlice`.
  - Remove `detectDesktopSafari` and the `isDesktopSafari` store field — both
    existed only to compute the Lenis toggle default. No other consumer
    (verified by grep: only `preferences-store.ts` referenced `isDesktopSafari`).
- `components/accessibility/animation-toggles.tsx` — drop the `smoothScroll`
  selector and its entry in the `values` record. The toggle list is rendered by
  mapping `ANIMATION_KEYS`, so it self-prunes to just `letterAnimations`.
- `lib/i18n/locales/en.json` + `lib/i18n/locales/pl.json` — remove the
  `smoothScroll` accessibility label key.
- `package.json` — remove the `lenis` dependency and uninstall it.

After this change, `ANIMATION_KEYS` is `["letterAnimations"]` and the
preferences store no longer carries any scroll state.

## Change 2 — Drop the eggplant heroes from the page body

`app/page.tsx` stops rendering the experimental heroes and their separators:
`EggplantSun`, `MetatronsCube`, `HexLatticeShrineGold`, `CosmicFlower`,
`CosmicCultFlyer`, `GlamCosmicBillboard`, plus the `SacredSeparator` /
`GritPulseOverlay` decoration tied to them.

What remains on the page:

- `GradientMask` (top)
- `AnimatedLettersMask` intro
- `ProjectsSection` — commercial work
- `ProjectsSection` — freelance work
- `FullSection` — about
- `FullSection` — values
- `GradientMask` (bottom)

Unused imports in `app/page.tsx` are removed. The hero component files are left
untouched in `components/home/heroes/`.

## Change 3 — Port the animated eggplant brand mark, replace the nav logo

Source: `10x_devs/src/components/brand/`.

- Create `components/brand/` and port two files:
  - `animated-brand-logo.tsx` — the scatter-entrance dot-grid SVG
    (`AnimatedBrandLogo`). No wordmark, no link wrapper.
  - `brand-mark-dots.ts` — the shared geometry/colour source it depends on.
- One import fix in the ported files: `@/lib/utils` → `@/helpers/cn`.
  (`framer-motion` and the `cn` helper both already exist in this repo.)
- The "eggplant_notes" wordmark and the `BrandMark` link wrapper are **not**
  ported — eggplant mark only.

Then update `components/top-navigation/eggplant-logo.tsx`:

- Swap the inner `EggplantImage` for `AnimatedBrandLogo`.
- Keep the `Link href="/"` wrapper and the scroll-to-top `onClick` behavior.
- Drop the gsap fade-in `useGSAP` block — the logo's built-in scatter entrance
  replaces it.
- Keep the filename and `EggplantLogo` component name to minimize churn across
  its consumer (`top-navigation.tsx`).

## Out of scope

- Deleting any hero / experiment components.
- Removing native CSS smooth scroll or the logo's smooth `scrollTo`.
- Any redesign of the content sections themselves.
- Final page composition beyond removing the heroes (further layout work is a
  separate task).
