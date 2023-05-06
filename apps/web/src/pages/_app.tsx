import '../styles.css';

import Loading from '@components/Shared/Loading';
import circluarStd from '@lib/lensterFont';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Providers = dynamic(() => import('@components/Common/Providers'), {
  ssr: false
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
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
