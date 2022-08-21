import '../styles.css';

import Loading from '@components/Loading';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Providers = dynamic(() => import('./Providers'));
const SiteLayout = dynamic(() => import('@components/SiteLayout'));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </Providers>
    </Suspense>
  );
};

export default App;
