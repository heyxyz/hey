import { i18n } from '@lingui/core';
import { detect, fromStorage } from '@lingui/detect-locale';
import { I18nProvider } from '@lingui/react';
import { Localstorage } from 'data';
import dayjs from 'dayjs';
import type { FC, ReactNode } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'src/i18n';
import defaultLocale from 'src/locales/en/messages';

const getLocale = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  let locale = detect(fromStorage(Localstorage.LocaleStore)) ?? DEFAULT_LOCALE;

  if (!SUPPORTED_LOCALES.hasOwnProperty(locale)) {
    locale = DEFAULT_LOCALE;
  }

  return locale;
};

const activateDefaultLocale = () => {
  const { messages } = defaultLocale;
  i18n.load(DEFAULT_LOCALE, messages);
  i18n.activate(DEFAULT_LOCALE);
  dayjs.locale(DEFAULT_LOCALE);
};

const dynamicActivate = async (locale: string) => {
  try {
    console.log(`Loading locale "${locale}"...`);
    const { messages } = await import(`../../../locales/${locale}/messages`);
    i18n.load(locale, messages);
    i18n.activate(locale);
    dayjs.locale(locale);
  } catch (error) {
    console.error(`Error loading locale "${locale}:"`, error);
    activateDefaultLocale();
  }
};

const locale = getLocale();
if (locale === DEFAULT_LOCALE) {
  activateDefaultLocale();
} else {
  dynamicActivate(locale);
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export default LanguageProvider;
