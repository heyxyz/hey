import '../styles.css';

import Layout from '@components/Layout';
import Providers from '@components/Providers';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </Providers>
  );
};

export default App;
