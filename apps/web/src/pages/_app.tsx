import type { AppProps } from 'next/app';

import FullPageLoader from '@components/Shared/FullPageLoader';
import { heyFont } from '@helpers/fonts';
import dynamic from 'next/dynamic';

import '../styles.css';

const Providers = dynamic(() => import('@components/Common/Providers'), {
  loading: () => <FullPageLoader />
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style global jsx>{`
        body {
          font-family: ${heyFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
