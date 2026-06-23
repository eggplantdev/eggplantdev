---
change_id: turbopack-dev
title: Switch dev server from legacy webpack to Turbopack
status: complete
created: 2026-06-23
updated: 2026-06-23
archived_at: null
---

## Notes

`next dev --webpack` on Next 16.2 was dying **silently** during active editing
sessions (process exits, no stack — the signature of a webpack-dev worker death).
Diagnosis ruled out a memory leak: RSS stayed bounded (340–750 MB) across repeated
loads and forced rebuilds, on 16 GB RAM. `next.config.ts` has no custom `webpack()`
config, so nothing required the legacy bundler.

Fix (commit `e7e07d8`): change the `dev` script to `next dev --turbopack`.
Turbopack is the Next 16 default — boots in ~280 ms and serves the app cleanly
(verified `/` and `/icon` return 200, no console/hydration errors).

**Lesson:** on Next 16, prefer Turbopack for `dev`. Only fall back to `--webpack`
if a webpack-specific config or loader is genuinely needed — and expect the legacy
dev path to be unstable.

### Out of scope

`next build` still uses the default bundler (unchanged); no Turbopack-specific
config was added.
