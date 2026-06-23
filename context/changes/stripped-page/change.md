---
change_id: stripped-page
title: Strip the home page to a working baseline (remove Lenis, drop hero experiments, port brand logo)
status: complete
created: 2026-06-23
updated: 2026-06-23
archived_at: null
---

## Notes

Retro record of the session that took the home page from the experiment-heavy
`animations_tests` branch state to a clean, working baseline. Nothing was thrown
away — experimental components remain in the repo, just unreferenced by the page.

Original brainstorm + plan live in `docs/superpowers/`:

- Spec: `docs/superpowers/specs/2026-06-23-stripped-page-design.md`
- Plan: `docs/superpowers/plans/2026-06-23-stripped-page.md`

### What shipped (commit → what)

- `8517e83` — Port the animated eggplant brand mark from `10x_devs`
  (`components/brand/animated-brand-logo.tsx` + `brand-mark-dots.ts`, mark only,
  no wordmark) and swap it into the nav logo (`EggplantLogo`).
- `86c5d1e` — Drop the experimental eggplant heroes from `app/page.tsx`
  (EggplantSun, MetatronsCube, HexLatticeShrineGold, CosmicFlower,
  CosmicCultFlyer, GlamCosmicBillboard). Components left in `components/home/heroes/`.
- `04ab113`, `ef1a543` — Remove the Lenis smooth-scroll system: delete the
  `SmoothScroll` wrapper, the `smoothScroll` preference/toggle, the desktop-Safari
  detection that only fed its default, the i18n labels, and the `lenis` dependency.
  Native CSS `scroll-smooth` kept.
- `cc27532` — Mount the brand logo in the nav (the logo block had been commented out).
- `f27821a` — Shrink the nav logo (`size-8 sm:size-10 lg:size-12`) and use the
  brand-mark dot grid as the favicon (`app/icon.tsx`, replacing the PNG).
- `4d1f2b0` — Project accordion items folded by default (no item forced open).
- `60f811c` — Even vertical gaps between home sections (`gap-y-32 md:gap-y-48`).
- `6960288` — Deterministic preferences-store init + `PreferencesHydrator` to stop
  a locale hydration mismatch (see below).

### Bugs found and fixed during the work

- **Page wouldn't scroll** (`b71d598`): `<body>` had `overflow-x-hidden`, which
  forces `overflow-y: auto`, making the body a dead nested scroll container.
  With `overscroll-none`, the wheel was absorbed and never chained to the real
  `<html>` scroller (keyboard still worked). Lenis had masked this by hijacking
  the wheel; removing it exposed it. Fix: `<body>` → `overflow-x-clip`.
- **Letters wheel-trap** (`6d130aa`): the intro container used
  `overflow-x-hidden overflow-y-scroll no-scrollbar` — a hidden scroll container.
  Switched to `overflow-x-clip`.
- **Locale hydration mismatch** (`6960288`): the Zustand preferences store read
  `localStorage`/`matchMedia` at module load, so the client's first render used the
  persisted locale (`pl`) while the server rendered the default (`en`) → React
  regenerated the whole tree. Fixed by deterministic init + post-mount hydration.

### Known follow-ups

- ✅ Resolved — Polish locale hydration flip: pinned to `en` in the
  `disable-locale-temporarily` change (persisted locale ignored, toggle hidden).
  The SplitType intro re-split caveat only matters if/when the locale toggle
  returns; tracked in that change's restore notes.
- `overscroll-none` on `<body>` is now a no-op (body is no longer a scroll
  container); move to `<html>` or drop if overscroll containment is wanted.
- The nav wordmark has since returned as `eggplant_dev` via an in-flight
  brand-intro splash/morph feature (`components/brand/brand-intro-*`,
  `intro-wordmark.tsx`). That feature is not yet documented — its own change
  record is pending until it lands. This record's "mark only, no wordmark" line
  describes the original port, not the current nav.

Note: `public/logos/eggplant-logo.png` is NOT orphaned — still used by
`spinner.tsx`, `page-preloader.tsx`, and `eggplant-image.tsx`. The favicon
switch (`app/icon.tsx`) only stopped _the favicon_ from reading it.

### Out of scope

Deleting any experiment/hero components; redesigning the content sections; final
page composition beyond removing the heroes.
