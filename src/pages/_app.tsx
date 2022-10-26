import '../styles.css';

import Loading from '@components/Loading';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { lazy, Suspense } from 'react';
const Providers = lazy(() => import('@components/Providers'));
const Layout = lazy(() => import('@components/Layout'));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </Providers>
    </Suspense>
  );
};

export default App;
