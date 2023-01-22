## Internationalization

Lenster uses [Crowdin](https://translate.lenster.xyz) for managing translations. A GitHub workflow uploads new strings for translation to the Crowdin project whenever code using the lingui translation macros is merged into `main`.

Every day, translations are synced back down from Crowdin to a pull request to `main`. We then merge these PR's into `main` manually.

### Marking strings for translation

Any user-facing strings that are added or modified in the source code should be marked for translation. Use the `t` macro or the `Trans` component from the `@lingui/macro` library. [Learn more](https://lingui.js.org/ref/macro.html).

```ts
const myString = t`Example text`;
```

```tsx
<Trans>Example text</Trans>
```

**You must extract strings in PRs**. If your PR adds or modifies translated strings, run the following command to generate new `.po` files:

```bash
yarn i18n:extract
```

### Contributing translations

- Sign up to Crowdin and go to [Lenster](https://translate.lenster.xyz) project page.
- Select the language you’d like to contribute to and request access:
  <img width="1465" alt="image" src="https://user-images.githubusercontent.com/69431456/213901159-abc8e619-089c-4bd3-acf9-6428c77cc918.png">
- Drop a message in the Translators channel of our Discord to introduce yourself and let us know you’ve requested access.
- Once you’ve been given access, you can start making translations.
- Once your translations have been approved by a proofreader they’ll be automatically synced with the Lenster site!
- You are a proofreader too but, you can’t appove your translations.
- If you identify some error in any translation please, comment your revision proposal on the comments in the right column before approve and wait for the translator answer!

### Adding a language (for devs)

1. Add the locale code, english name, and short and long alias's to `constants/languages/language-options.ts`.

```diff
export const Languages: Language = {
  en: { code: 'en', name: 'english', short: 'EN', long: 'English' },
  zh: { code: 'zh', name: 'chinese', short: '中文', long: '中文' },
  ru: { code: 'ru', name: 'russian', short: 'RU', long: 'Pусский' },
+ es: { code: 'es', name: 'spanish', short: 'ES', long: 'Español' },
}
```

1. Add the locale code to `./apps/web/linguirc.json`.

```diff
- "locales": ["en", "es"]
+ "locales": ["en", "es", "ta"]
```

1. Import the locale plurals in `./apps/web/src/lib/i18n.ts`.

```diff
- import { en, es } from 'make-plural/plurals'
+ import { en, es, ta } from 'make-plural/plurals'
```

1. Load the locale plurals in `./apps/web/src/lib/i18n.ts`

```diff
i18n.loadLocaleData({
  en: { plurals: en },
  es: { plurals: es },
+ ta: { plurals: ta },
})
```

1. Extract and compile the strings marked for translation. This creates a directory for the locale within the `./apps/web/src/locales/` directory:

```bash
yarn i18n:extract
```
