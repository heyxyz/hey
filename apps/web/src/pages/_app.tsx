import '../styles.css';

import Loading from '@components/Shared/Loading';
import circluarStd from '@lib/lensterFont';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { lazy, Suspense, useMemo } from 'react';
import { useAppPersistStore } from 'src/store/app';

const Providers = lazy(() => import('@components/Common/Providers'));

const App = ({ Component, pageProps }: AppProps) => {
  const notificationCount = useAppPersistStore(
    (state) => state.notificationCount
  );

  const hasNotifications = useMemo(
    () => notificationCount > 0,
    [notificationCount]
  );

  return (
    <Suspense fallback={<Loading />}>
      <Head>
        <meta name="testme" content="yes" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/favicon-32x32${hasNotifications ? '-notification' : ''}.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/favicon-16x16${hasNotifications ? '-notification' : ''}.png`}
        />
      </Head>

      <Providers>
        <style jsx global>{`
          body {
            font-family: ${circluarStd.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </Providers>
    </Suspense>
  );
};

export default App;
