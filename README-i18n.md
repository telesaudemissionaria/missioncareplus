i18n notes for MissionCare Plus

This project uses a lightweight, centralized translator located at `assets/js/translator.js`.

How it works
- `assets/js/translator.js` exports `window.Translator` with `init(options)` and `applyTranslations(lang)`.
- `Translator.init({ storageKey, defaultLang })` wires `.lang-btn` elements and applies the stored or default language.
- Pages should use `data-i18n="key"` for elements (and `data-i18n-placeholder` for placeholders).
- Translation dictionaries are kept in `assets/js/translator.js` under `translations.{pt,en,es}`.

Maintainers: when adding new strings
1. Add the key to the centralized `translations` object in `assets/js/translator.js` for each language.
2. Replace any page-local `const translations = { ... }` with a reference to `window.translations` or remove it entirely.
3. Use `data-i18n` attributes on HTML elements; avoid inline string concatenation where possible.
4. Run the site locally and verify language switching and that `data-i18n` values render correctly.

Notes
- Several pages retain short, page-scoped fallbacks that proxy to `window.translations` for backward compatibility.
- Storage keys per page preserved for compatibility (e.g. `triage_pediatric_lang`, `gob_triage_lang`, `appLanguage`, site-wide `lang`).

Recommended follow-ups
- Consolidate any remaining duplicated keys into the central file and remove fallbacks.
- Consider splitting translations into JSON files and loading them lazily if the site grows.
- Use a small script to validate that all `data-i18n` attributes have entries in the translator.
