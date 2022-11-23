import '../styles.css';

import Loading from '@components/Loading';
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

      {/* Begin Simple Analytics */}
      <Script strategy="lazyOnload" id="sa-script">
        {`window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]};`}
      </Script>
      <Script strategy="lazyOnload" data-collect-dnt="true" src="https://leafwatch.lenster.xyz/latest.js" />
      <noscript>
        <img
          src="https://leafwatch.lenster.xyz/noscript.gif"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
      {/* End Simple Analytics */}
    </Suspense>
  );
};

export default App;
