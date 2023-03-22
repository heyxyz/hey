import { i18n } from '@lingui/core';
import { LS_KEYS } from 'data/constants';
import dayjs from 'dayjs';
import { en, es, ta, zh } from 'make-plural/plurals';

export const supportedLocales: Record<string, string> = {
  en: 'English',
  es: 'Spanish - Español',
  ta: 'Tamil - தமிழ்',
  zh: 'Chinese - 中文'
};

const defaultLocale = 'en';

i18n.loadLocaleData({
  en: { plurals: en },
  es: { plurals: es },
  ta: { plurals: ta },
  zh: { plurals: zh }
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
  localStorage.setItem(LS_KEYS.SELECTED_LOCALE, JSON.stringify(locale));
  const { messages } = await import(`src/locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
  dayjs.locale(locale);
}

export const initLocale = () => {
  const storedValue = localStorage.getItem(LS_KEYS.SELECTED_LOCALE);
  const locale = storedValue ? JSON.parse(storedValue) : defaultLocale;
  setLocale(locale);
};
