# Lessons Learned

> Append-only register of recurring rules and patterns. Re-read at start by /10x-frame, /10x-research, /10x-plan, /10x-plan-review, /10x-implement, /10x-impl-review.

## Restart Turbopack on ignored style edits — don't re-edit correct source

- **Context**: Any visual/styling task in this Next.js + Turbopack dev workflow — `@theme` token edits in `styles/globals.css`, or Tailwind className/color changes in components.
- **Problem**: Turbopack's file watcher silently misses some writes and keeps serving stale CSS/markup. A correct color edit appeared ignored 3× in one session ("still goldy"), wasting cycles chasing a non-existent code bug.
- **Rule**: When a style/token edit looks ignored in the browser, first confirm the computed value (`getComputedStyle` on the element / `:root` var) to split "stale cache" from "wrong code". If source is correct, kill the dev server + `rm -rf .next/dev .next/cache` + restart — do NOT re-edit correct source.
- **Applies to**: implement, impl-review

## z-index applies to flex/grid children even when position:static

- **Context**: Stacking/layout work in any `display:flex|grid` container whose children are layered by z-index — especially fixed/absolute overlay layers (grit texture, ambient dots, modals) vs. page content. Canonical case: `app/layout.tsx`, where `<main>` is a flex child of `#debug_wrapper`.
- **Problem**: The textbook "z-index needs a positioned element" rule does NOT hold for flex/grid items — they obey z-index at `position:static`. A stray `z-201` on `<main>` outranked the `z-200` grit overlay and silently painted over it, hiding the texture and dots. The overlay element inspected as perfectly healthy (fixed, z-200, opacity 1, asset 200) — which misleads you away from the real cause.
- **Rule**: When layering fixed/absolute overlays by z-index, keep content z-index below the overlay layers and remember flex/grid children honor z-index regardless of `position`. When an element is invisible but looks correct in computed styles, confirm with a pixel-diff (hide it → did pixels change?) before trusting the inspector.
- **Applies to**: implement, impl-review, plan-review
