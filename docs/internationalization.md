# Internationalization

Lenster uses [Crowdin](https://translate.lenster.xyz) for managing translations. A GitHub workflow uploads new strings for translation to the Crowdin project whenever code using the lingui translation macros is merged into `main`.

Every day, translations are synced back down from Crowdin to a pull request to `main`. We then merge these PR's into `main` manually.

## Marking strings for translation

Any user-facing strings that are added or modified in the source code should be marked for translation. Use the `t` macro or the `Trans` component from the `@lingui/macro` library. [Learn more](https://lingui.js.org/ref/macro.html).

```ts
const myString = t`Example text`;
```

```tsx
<Trans>Example text</Trans>
```

**You must extract strings in PRs**. If your PR adds or modifies translated strings, run the following command to generate new `.po` files:

```bash
pnpm i18n:extract
```

## Contributing translations

- Sign up to Crowdin and go to [Lenster](https://translate.lenster.xyz) project page.
- Select the language you’d like to contribute to and request access:
  <img width="1465" alt="image" src="https://user-images.githubusercontent.com/69431456/213901159-abc8e619-089c-4bd3-acf9-6428c77cc918.png">
- Drop a message in the Translators channel of our Discord to introduce yourself and let us know you’ve requested access.
- Once you’ve been given access, you can start making translations.
- Once your translations have been approved by a proofreader they’ll be automatically synced with the Lenster site!
- You are a proofreader too but, you can’t approve your translations.
- If you identify some error in any translation please, comment your revision proposal on the comments in the right column before approve and wait for the translator answer!

## Adding a language (for devs)

1. Add the locale code to `./apps/web/lingui.config.js`.

```diff
- locales: ['en', 'es']
+ locales: ['en', 'es', 'ta']
```

2. Add the locale code and long alias's to `./apps/web/src/i18n.ts`.

```diff
export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English',
  es: 'Español',
+ ta: 'தமிழ்'
};
```

3. Extract and compile the strings marked for translation. This creates a directory for the locale within the `./apps/web/src/locales/` directory:

```bash
pnpm i18n:extract
```
