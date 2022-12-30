import { i18n } from '@lingui/core';
import { IS_PREVIEW, IS_PRODUCTION, LS_KEYS } from 'data/constants';
import dayjs from 'dayjs';
import { en, es, kn, ta } from 'make-plural/plurals';

export const supportedLocales: Record<string, string> = {
  en: 'English',
  es: 'Español',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ'
};

if (!IS_PRODUCTION || IS_PREVIEW) {
  supportedLocales.qaa = 'PseudoLanguage';
}

const defaultLocale = 'en';

i18n.loadLocaleData({
  en: { plurals: en },
  es: { plurals: es },
  ta: { plurals: ta },
  kn: { plurals: kn },
  qaa: { plurals: en }
});

/**
 * set locale and dynamically import catalog
 * @param locale a supported locale string
 */
export async function setLocale(locale: string) {
  if (!supportedLocales.hasOwnProperty(locale)) {
    console.error('warning: unknown locale', locale);
    locale = defaultLocale;
  }
  localStorage.setItem(LS_KEYS.SELECTED_LOCALE, JSON.stringify(locale));
  const { messages } = await import(`src/locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale ? locale : defaultLocale);
  dayjs.locale(locale);
}

export const initLocale = () => {
  const storedValue = localStorage.getItem(LS_KEYS.SELECTED_LOCALE);
  const locale = storedValue ? JSON.parse(storedValue) : defaultLocale;
  setLocale(locale);
};
