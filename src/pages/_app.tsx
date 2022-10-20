import '../styles.css';

import Layout from '@components/Layout';
import Loading from '@components/Loading';
import Providers from '@components/Providers';
import type { AppProps } from 'next/app';
import { Suspense } from 'react';

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
