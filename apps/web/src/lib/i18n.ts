import { i18n } from '@lingui/core';
import dayjs from 'dayjs';
import { cs, en } from 'make-plural/plurals';

export const supportedLocales = {
  en: 'English',
  cs: 'Česky'
};

const defaultLocale = 'en';

i18n.loadLocaleData({
  en: { plurals: en },
  cs: { plurals: cs }
});

import('dayjs/locale/cs');

const localStorageKey = 'selectedLocale';

/**
 * set locale and dynamically import catalog
 * @param locale a supported locale string
 */
export async function setLocale(locale: string) {
  if (!supportedLocales.hasOwnProperty(locale)) {
    console.error('warning: unknown locale', locale);
    locale = defaultLocale;
  }
  localStorage.setItem(localStorageKey, JSON.stringify(locale));
  const { messages } = await import(`src/locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
  dayjs.locale(locale);
}

export const initLocale = () => {
  const storedValue = localStorage.getItem(localStorageKey);
  const locale = storedValue ? JSON.parse(storedValue) : defaultLocale;
  setLocale(locale);
};
