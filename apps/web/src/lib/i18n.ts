import { i18n } from '@lingui/core';
import { Localstorage } from 'data/storage';
import dayjs from 'dayjs';
import { en, es, fr, ru, ta, zh } from 'make-plural/plurals';

export const supportedLocales: Record<string, string> = {
  en: 'English',
  es: 'Spanish - Español',
  ta: 'Tamil - தமிழ்',
  zh: 'Chinese - 中文',
  ru: 'Russian - русский',
  fr: 'French - français'
};

const defaultLocale = 'en';

i18n.loadLocaleData({
  en: { plurals: en },
  es: { plurals: es },
  ta: { plurals: ta },
  zh: { plurals: zh },
  ru: { plurals: ru },
  fr: { plurals: fr }
});

/**
 * Sets the current locale and dynamically loads the corresponding catalog of messages.
 *
 * @param locale a supported locale string
 */
export async function setLocale(locale: string) {
  if (!supportedLocales.hasOwnProperty(locale)) {
    locale = defaultLocale;
  }
  localStorage.setItem(Localstorage.LocaleStore, JSON.stringify(locale));
  const { messages } = await import(`src/locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
  dayjs.locale(locale);
}

export const initLocale = () => {
  const storedValue = localStorage.getItem(Localstorage.LocaleStore);
  const locale = storedValue ? JSON.parse(storedValue) : defaultLocale;
  setLocale(locale);
};

/**
 * get primary language from IETF language tag
 * see https://en.wikipedia.org/wiki/IETF_language_tag
 * example: extract "en" from "en-US"
 * @param languageTag IETF BCP 47 language tag
 * @returns the primary language code of the tag
 */
export const getPrimaryLanguage = (languageTag: string): string => {
  return languageTag ? languageTag.split('-')[0] : '';
};
