import type { AppProps } from 'next/app';

import Providers from '@components/Common/Providers';
import heyFont from '@lib/heyFont';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '../styles.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style global jsx>{`
        body {
          font-family: ${heyFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </Providers>
  );
};

export default App;
