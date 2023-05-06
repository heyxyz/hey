import '../styles.css';

import Loading from '@components/Shared/Loading';
import circluarStd from '@lib/lensterFont';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('@components/Common/Providers'), {
  ssr: false,
  loading: () => <Loading />
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        body {
          font-family: ${circluarStd.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
