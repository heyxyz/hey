import '../styles.css';

import Loading from '@components/Shared/Loading';
import type { AppProps } from 'next/app';
import { lazy, Suspense } from 'react';

import atypFont from '../font/atyp';
import atypTextFont from '../font/atypText';

const Providers = lazy(() => import('@components/Common/Providers'));
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <style jsx global>{`
          body {
            font-family: ${atypTextFont.style.fontFamily};
          }
        `}</style>
        <Component
          {...pageProps}
          className={`${atypFont.variable} ${atypTextFont.variable} ${atypFont.className}`}
        />
      </Providers>
    </Suspense>
  );
};

export default App;
