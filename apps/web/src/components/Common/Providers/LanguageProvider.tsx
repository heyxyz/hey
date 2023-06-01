import { Localstorage } from '@lenster/data';
import { i18n } from '@lingui/core';
import { detect, fromStorage } from '@lingui/detect-locale';
import { I18nProvider } from '@lingui/react';
import dayjs from 'dayjs';
import type { FC, ReactNode } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'src/i18n';

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

const dynamicActivate = async (locale: string) => {
  const { messages } = await import(
    `@lingui/loader!../../../locales/${locale}/messages.po`
  );
  i18n.load(locale, messages);
  i18n.activate(locale);
  dayjs.locale(locale);
};

const locale = getLocale();
dynamicActivate(locale);

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export default LanguageProvider;
