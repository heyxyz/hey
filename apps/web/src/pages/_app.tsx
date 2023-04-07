import '../styles.css';
import 'react-virtualized/styles.css';

import Loading from '@components/Shared/Loading';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import { lazy, Suspense } from 'react';

const Providers = lazy(() => import('@components/Common/Providers'));

const circluarStd = localFont({
  src: [
    {
      path: '../../public/fonts/CircularXXSub-Book.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/CircularXXSub-Medium.woff',
      weight: '500',
      style: 'medium'
    },
    {
      path: '../../public/fonts/CircularXXSub-Bold.woff',
      weight: '700',
      style: 'bold'
    }
  ],
  variable: '--lenster-font',
  fallback: ['sans-serif'],
  preload: true,
  display: 'swap'
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
