import '../styles.css';

import Loading from '@components/Loading';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Provider = dynamic(() => import('./Provider'));
const SiteLayout = dynamic(() => import('@components/SiteLayout'));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Provider>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </Provider>
    </Suspense>
  );
};

export default App;
