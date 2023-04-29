import { i18n } from '@lingui/core';
import { Localstorage } from 'data/storage';
import dayjs from 'dayjs';
import { en, es, kn, ru, ta, zh } from 'make-plural/plurals';

export const supportedLocales: Record<string, string> = {
  en: 'English',
  es: 'Spanish - Español',
  ta: 'Tamil - தமிழ்',
  zh: 'Chinese - 中文',
  kn: 'Kannada - ಕನ್ನಡ',
  ru: 'Russian - русский'
};

const defaultLocale = 'en';

/**
 * Sets the current locale and dynamically loads the corresponding catalog of messages.
 *
 * @param locale a supported locale string
 */
export async function setLocale(locale: string) {
  if (!Object.keys(supportedLocales).includes(locale)) {
    locale = defaultLocale;
  }
  localStorage.setItem(Localstorage.LocaleStore, JSON.stringify(locale));
  const { messages } = await import(`@lingui/loader!../locales/${locale}/messages.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
  dayjs.locale(locale);
}

/**
 * Initializes the i18n library with the default locale.
 */
export const initLocale = () => {
  i18n.load({
    en: { plurals: en },
    es: { plurals: es },
    ta: { plurals: ta },
    zh: { plurals: zh },
    kn: { plurals: kn },
    ru: { plurals: ru }
  });
  const storedValue = localStorage.getItem(Localstorage.LocaleStore);
  const locale = storedValue ? JSON.parse(storedValue) : defaultLocale;
  setLocale(locale);
};
