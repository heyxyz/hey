import '../styles.css';

import Loading from '@components/Shared/Loading';
import { initLocale } from '@lib/i18n';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import type { AppProps } from 'next/app';
import React, { lazy, Suspense, useEffect } from 'react';

const Providers = lazy(() => import('@components/Common/Providers'));

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <Suspense fallback={<Loading />}>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </Suspense>
    </I18nProvider>
  );
};

export default App;
