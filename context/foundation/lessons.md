# Lessons Learned

> Append-only register of recurring rules and patterns. Re-read at start by /10x-frame, /10x-research, /10x-plan, /10x-plan-review, /10x-implement, /10x-impl-review.

## Restart Turbopack on ignored style edits — don't re-edit correct source

- **Context**: Any visual/styling task in this Next.js + Turbopack dev workflow — `@theme` token edits in `styles/globals.css`, or Tailwind className/color changes in components.
- **Problem**: Turbopack's file watcher silently misses some writes and keeps serving stale CSS/markup. A correct color edit appeared ignored 3× in one session ("still goldy"), wasting cycles chasing a non-existent code bug.
- **Rule**: When a style/token edit looks ignored in the browser, first confirm the computed value (`getComputedStyle` on the element / `:root` var) to split "stale cache" from "wrong code". If source is correct, kill the dev server + `rm -rf .next/dev .next/cache` + restart — do NOT re-edit correct source.
- **Applies to**: implement, impl-review
