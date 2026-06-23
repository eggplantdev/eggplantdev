# Eggplant Notes-style persistent hero — design

**Date:** 2026-06-23
**Status:** Approved (design), pending implementation plan

## Goal

Restructure the home page intro to mimic the Eggplant Notes app (`/Users/konradantonik/workspace/10x_devs`, live at eggplant-notes.vercel.app):

1. The splash logo **and** wordmark morph **down into a centered hero** and **stay** on the page, instead of the logo morphing **up into the nav** while the wordmark is discarded (today's behaviour).
2. The hero eggplant is **centered** and **smaller** (`size-20 sm:size-24`, down from the splash's `size-44 sm:size-60`) — matching how Eggplant Notes lands it.
3. The big `AnimatedLettersMask` paragraph ("Since 2022, this one-veg army…") **moves from the top to below the projects**, paired with the black-and-white portrait.
4. The nav keeps a **plain static** eggplant logo (no morph target).

## Background

The portfolio's brand-intro system was forked from Eggplant Notes — same phase machine (`idle → splash → morph → reveal → done | skip`), same `AnimatedBrandLogo`, `IntroWordmark`, veil, and no-flash script. The **only** structural difference is the morph wiring:

|                       | Eggplant Notes                            | Portfolio (today)              |
| --------------------- | ----------------------------------------- | ------------------------------ |
| Morph target          | hero `BrandIntroLockup` (logo + wordmark) | nav `EggplantLogo` (logo only) |
| Wordmark after splash | morphs into hero, stays                   | fades out with veil, gone      |
| Nav logo              | static, separate                          | the morph target               |

So this work is a **retrofit** of EN's hero-lockup pattern, not new invention.

## Final page structure (`app/page.tsx`)

```
hero (NEW)            ← BrandIntroLockup: centered eggplant + wordmark tagline (morph target, persists)
commercial projects   (existing ProjectsSection)
freelance projects    (existing ProjectsSection)
about block (NEW)     ← AnimatedLettersMask "Since 2022…" (moved from top) + ja_summer_bw.jpeg portrait
about FullSection     (existing, kept as-is)
values FullSection    (existing, kept as-is)
```

- Order confirmed: hero → commercial → freelance → [letters + portrait] → about → values. Nothing removed.
- The relocated paragraph overlaps in purpose with the existing `about` FullSection; **out of scope to merge** — both kept, user reconciles later if desired.

## Components

### 1. `components/brand/brand-intro-lockup.tsx` (NEW)

Direct port of EN's `BrandIntroLockup`. The hero morph target. Phase-driven render:

- `splash` — reserved invisible footprint (so page layout doesn't shift); the splash overlay owns the visible mark.
- `morph` / `reveal` — `motion.div layoutId="brand-logo"` (logo) + `motion.div layoutId="brand-wordmark"` (wordmark), z-lifted above the veil, shared `easeOutExpo` 1s glide.
- `done` — settled logo + wordmark, no `layoutId`/z-lift.
- `idle` / `skip` — scatter in place (normal page-load behaviour).

Hero sizes: logo `size-20 sm:size-24`, wordmark `mt-3 font-mono text-lg font-semibold tracking-tight sm:text-xl` (EN's values). Centered column (`flex flex-col items-center text-center`).

### 2. `components/brand/intro-wordmark.tsx` (MODIFY)

Add an optional `layoutId` prop (mirror EN) and apply it to the outer `motion.div`, so the splash wordmark can morph into the hero copy. Keep the existing `className` prop and the cascade animation.

### 3. `components/brand/brand-intro-provider.tsx` (MODIFY)

Splash lockup wordmark passes `layoutId="brand-wordmark"`. No other changes to the timing machine.

### 4. `components/top-navigation/eggplant-logo.tsx` (MODIFY)

Remove the `morph`/`reveal` branch carrying `layoutId="brand-logo"`. The nav logo becomes a plain `AnimatedBrandLogo` across phases:

- `splash` / `morph` — hidden behind the opaque veil anyway (nav `z-99999` < veil `z-100000`); render a reserved/invisible footprint so the nav doesn't reflow when it appears.
- `idle` / `skip` — scatter in place; `done` — settled.
- The "eggplant_dev" nav wordmark behaviour is unchanged.

### 5. `components/top-navigation/top-navigation.tsx` (MODIFY)

Remove the `logoLifted` z-bump (the morph no longer targets the nav, so the nav logo layer never needs to sit above the veil). Keep `chromeHidden` for the hamburger/dropdown.

### 6. `app/page.tsx` (MODIFY)

- Replace the top `<AnimatedLettersMask>` with a centered hero `<section>` rendering `<BrandIntroLockup>`.
- After the freelance `ProjectsSection`, insert a new block: the b&w portrait (`/images/ja_summer_bw.jpeg`, `next/image`) **side-by-side** with `<AnimatedLettersMask text={introTxt} />` on desktop (`md:`), **stacked** on mobile. Image first in the row.
- Keep `about` and `values` FullSections after the new block.

## Constraints / notes

- `prefers-reduced-motion` and returning-visitor (`skip`) paths must still work: the hero lockup renders a settled, scattered-in-place mark with no veil — covered by the `idle`/`skip` branch ported from EN.
- The portrait needs intrinsic dimensions for `next/image`; use a fixed aspect container with `object-cover` if exact dimensions aren't read.
- Styling: Tailwind v4 tokens, no arbitrary values where a token exists; follow existing `fest-container` layout wrapper used by the sections.
- No barrel exports; import component files directly.

## Out of scope

- Merging the relocated paragraph with the `about` FullSection.
- Any change to project cards, footer, or the section components themselves.
- Copy changes to `introTxt` or the `WORDMARK`.
