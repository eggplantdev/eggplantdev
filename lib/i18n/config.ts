import type { LocaleT } from "./types";

// Temporary single-locale pin.
//
// The full i18n wiring stays in the repo — pl.json/en.json, getTranslations, the
// preferences-store locale field, useLocalizedData, useTranslation, and the
// LanguageSwitcher are all untouched. While LOCALE_ENABLED is false the app is
// hard-pinned to ACTIVE_LOCALE: persisted locale is ignored, setLocale is a no-op,
// and the language toggle is hidden. This keeps SSR and the client's first render
// on the same locale, removing the hydration mismatch the Polish version caused.
//
// To restore multi-locale + the toggle: set LOCALE_ENABLED = true. Nothing else.
export const LOCALE_ENABLED = false;
export const ACTIVE_LOCALE: LocaleT = "en";
