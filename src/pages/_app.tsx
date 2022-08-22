import '../styles.css';

import Loading from '@components/Loading';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Providers = dynamic(() => import('@components/Providers'), { suspense: true });
const Layout = dynamic(() => import('@components/Layout'), { suspense: true });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
  );
};

export default App;
