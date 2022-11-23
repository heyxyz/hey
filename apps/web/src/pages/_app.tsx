import '../styles.css';

import Loading from '@components/Loading';
import { IS_PRODUCTION } from 'data/constants';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { lazy, Suspense } from 'react';
const Providers = lazy(() => import('@components/Providers'));
const Layout = lazy(() => import('@components/Layout'));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
      {IS_PRODUCTION && (
        <>
          <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
          <noscript>
            <img
              src="https://queue.simpleanalyticscdn.com/noscript.gif"
              alt=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          </noscript>
        </>
      )}
    </Suspense>
  );
};

export default App;
