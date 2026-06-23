---
change_id: disable-locale-temporarily
title: Temporarily pin the app to a single locale (en), keeping all i18n wiring
status: complete
created: 2026-06-23
updated: 2026-06-23
archived_at: null
---

## Notes

We don't need a language switcher right now and won't be changing locale, so the
Polish version is the source of a hydration mismatch (server renders `en`, a
client with persisted `pl` renders `pl`). Rather than rip out i18n, pin the app
to a single locale behind one flag. **The wiring stays — this is reversible and
the locale support will return.**

### Approach (chosen, approved)

Single flag in `lib/i18n/config.ts`:

```ts
export const LOCALE_ENABLED = false;
export const ACTIVE_LOCALE: LocaleT = "en";
```

While `LOCALE_ENABLED` is `false`:

- **`stores/preferences-store.ts` → `hydrate()`** ignores any persisted locale and
  forces `ACTIVE_LOCALE`. So a browser with `preferences.locale = "pl"` in
  localStorage still renders `en`, matching the server → no hydration mismatch.
- **`stores/preferences-store.ts` → `setLocale()`** is a no-op.
- **`components/accessibility/language-switcher.tsx`** returns `null` (toggle hidden).

Everything else is untouched: `pl.json`/`en.json`, `getTranslations`,
`TranslationsProvider`, `useLocalizedData`, `useTranslation`, the store's `locale`
field, and the `LanguageSwitcher` component all remain wired.

### Files touched

- `lib/i18n/config.ts` (new) — the flag + active locale.
- `stores/preferences-store.ts` — hydrate pin + setLocale guard.
- `components/accessibility/language-switcher.tsx` — hide while pinned.

### How to restore multi-locale + the toggle

1. Set `LOCALE_ENABLED = true` in `lib/i18n/config.ts`. That alone re-enables the
   persisted locale, `setLocale`, and the visible toggle.
2. Re-verify the SplitType intro (`AnimatedLettersMask`) updates on a post-mount
   locale switch — it currently does **not** re-split when text changes (see the
   `stripped-page` change's follow-ups). That intro is the one place a runtime
   locale switch is visibly incomplete; everything else updates via the i18n
   context. Fix before re-exposing the toggle, or accept the intro lag.

### Out of scope

Deleting any pl data/locale files; cookie-based server-side locale; fixing the
SplitType re-split (tracked as a follow-up, only relevant when locale returns).
