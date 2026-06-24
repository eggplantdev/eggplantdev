---
name: image-sizes-audit
description: >-
  Audit and fix the `sizes` prop on next/image components by MEASURING each
  image's real rendered width in a headless browser, then deriving the correct
  `sizes` string from reality. Use this whenever the user mentions image `sizes`,
  a wrong or stale `sizes` prop, oversized image downloads, blurry/low-res
  images, Next.js image performance, LCP/Lighthouse image weight, or has changed
  an image's width / column-span / container and needs `sizes` updated to match.
  Trigger even on casual asks like "are my image sizes right?", "why is this
  image downloading a huge file?", or "I resized this image — fix the sizes."
  Do NOT use for non-Next `<img>` tags, art-direction `<picture>` switches, or
  choosing image formats — only for `sizes` correctness on next/image.
---

# Auditing & fixing next/image `sizes`

## Why this exists

`sizes` tells the browser how wide the image will render, so it can pick the
right candidate from the srcSet. It is **decoupled from `width`/`height`** — a
wrong `sizes` never throws, it just silently makes Next serve the wrong source:
too large (wasted bytes, bad LCP) or too small (blurry). The classic bug is a
`100vw` tail on an image whose container caps out: on a 3440px ultrawide the
browser fetches a 3840w source for an image that physically never exceeds, say,
1440px.

**The effective width cap is the MINIMUM of every ancestor `max-width`**, not the
nearest one. A page wrapper `max-w-[1440px]` clamps an image even when its inner
`fest-container` allows 1920. Class math reads one and misses the other; the DOM
knows the real number. That is why this skill **measures** instead of computing
from grid classes — and why it is robust even when the codebase, the docs, and
the developer disagree about what the cap is.

## Workflow

### 1. Discover every next/image and where it renders

```
grep -rln "next/image" components app
```

Two shapes to handle:

- **Direct** — `<Image ... sizes="..." />`. Fix the attribute in place.
- **Wrapper** — a component (e.g. `CustomImgServer`) that forwards a `sizes`
  prop to `<Image>`. The attribute is correct in the wrapper; the value that
  needs fixing lives at each **call site**. Trace the prop: grep for the wrapper
  component name to find who renders it and with what `sizes`.

For each image, determine which **route(s)** actually render it (a shared
component may appear on several pages, at different widths — measure it on each).
Include the project's test routes if the image only mounts there.

### 2. Start the app

The script drives a real browser against the running app:

```
npm run dev            # next dev --turbopack, serves http://localhost:3000
```

Wait until the route responds before measuring. Production-like widths also work
with `npm run build && npm start` if dev-only layout shift is a concern.

### 3. Measure

`scripts/measure-image-sizes.mjs` loads each route, sweeps the project
breakpoints **and ultrawide samples (2560/3440)** to catch the max-width clamp,
and reads each `<img>`'s real `getBoundingClientRect().width` at every step.

```
node .claude/skills/image-sizes-audit/scripts/measure-image-sizes.mjs --route / --route /heros-test
```

It prints JSON per (route, image): the **current** `sizes`, the **recommended**
one derived from measurements, a `matches` flag, and the raw `vp -> width`
samples so you can sanity-check the derivation. It only touches images Next has
optimized (srcset through `/_next/image`); decorative `<img>`s are ignored.

How it derives the string: per breakpoint band it decides **vw** (width scales
with the viewport — use the band-top ratio so it never under-serves) vs **px**
(width is clamped constant — fix the pixel value). The clamped tail is the
ancestor `max-width` cap, observed, not assumed. Adjacent near-equal bands are
then **merged up** (keep the larger value, never under-serve) so the string stays
readable instead of emitting a segment per breakpoint. Tune with `--vw-tol`
(default 10vw) and `--px-tol` (default 0.1 = 10%); pass `--vw-tol 0 --px-tol 0`
for the exact, unmerged form. Output follows the project convention: `max-width`
anchors ascending, with the bare (unconditioned) value being the widest/desktop
case — the width no `max-width` condition covers. This mirrors the Next.js docs
example (`sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`): each
threshold is the band's upper edge, and the last value is the largest viewport. A
real home-page portrait reduces to
`(max-width: 640px) 71vw, (max-width: 1440px) 57vw, 747px`.

### 4. Apply fixes

For each image where `matches` is false, write the recommended `sizes`:

- Direct `<Image>` — edit the `sizes` attribute.
- Wrapper call site — edit the `sizes` prop passed to the wrapper.

Keep the project's `max-width` ascending, desktop-last (bare) ordering. Don't
reformat unrelated attributes. If the recommended string is only trivially
different (≤2px / ≤1vw rounding), leave it — churn isn't worth it.

### 5. Verify

Re-run the script on the affected routes and confirm `matches` is now true (or
within the rounding tolerance). Report what changed per image: old → new, and
the measured width that justifies it.

## Gotchas

- **DPR is Next's job, not yours.** `sizes` is in CSS pixels / vw. Next multiplies
  by device pixel ratio when choosing from the srcSet. Never bake `×2` into
  `sizes`.
- **`fill` images** have no intrinsic width — their rendered width is entirely
  the parent box, so measuring is the _only_ way to get `sizes` right.
- **Measure after layout settles.** The script waits after each resize; if a
  route animates layout on load, give it longer or measure post-animation.
- **One image, many routes.** A shared component can render wider on a landing
  page than in a card grid. The widest correct `sizes` across its real usages is
  the safe choice — or split the prop per call site.
- **Don't trust the docs or the token for the cap.** Whatever `--max-w-*` says,
  the script reports the width the browser actually painted. That number wins.
