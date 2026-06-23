# Claude Code Instructions

## Design Direction

The visual direction for this portfolio is defined in the master design prompt:
**`docs/design_spec/surreal-eggplant-supernova-prompt.md`**

Read this prompt before working on any hero concepts, section variants, or visual design tasks. It contains:

- The creative direction (surreal, sacred geometry, eggplants in space, neon + golden retro)
- The chosen direction (Echoes of Djembeya) with visual reference and implementation code
- Palette, typography, texture, and composition requirements
- Test page routes and component directories

## Layout grid

Page sections use two composable utilities defined in `styles/globals.css` (not Tailwind defaults):

- `fest-container` — centers content, caps width at `--max-w-xxl` (1920px), adds responsive side padding.
- `fest-grid` — the column grid: **4 cols → 8 (`640:`) → 12 (`md:`) → 16 (`xl:`/1440)**. Place children with `col-span-*` (e.g. `col-span-full`, `md:col-span-6`). See `ProjectsSection` for the canonical pattern.

Gotchas:

- `fest-grid` has `gap: 0` — there is no column gutter. Add spacing as padding on the item, never grid gap.
- Breakpoint prefixes are custom numeric tokens (`450:`, `640:`, `1280:`) alongside `md`/`lg`/`xl`. Half-width = half the column count at _that_ breakpoint (4/8 → `640:col-span-4`, 6/12 → `md:col-span-6`, 8/16 → `xl:col-span-8`).

## Test Pages

| Area                | Route                     | Registry File                                | Component Directory                                        |
| ------------------- | ------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Heroes (all agents) | `/heros-test`             | `app/(test)/heros-test/page.tsx`             | `hero-concepts/` (Claude) + `hero-codex-concepts/` (Codex) |
| Sections (all)      | `/sections-concepts-test` | `app/(test)/sections-concepts-test/page.tsx` | `section-concepts/` + `field-notes-propositions/`          |
