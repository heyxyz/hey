import '../styles.css';

import lensterFont from '@lib/lensterFont';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('@components/Common/Providers'), {
  ssr: false
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        body {
          font-family: ${lensterFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
