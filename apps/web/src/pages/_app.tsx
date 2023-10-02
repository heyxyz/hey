import '../styles.css';

import heyFont from '@lib/heyFont';
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
          font-family: ${heyFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
