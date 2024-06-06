import type { AppProps } from 'next/app';

import Providers from '@components/Common/Providers';
import { goodFont } from '@helpers/fonts';

import '../styles.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style global jsx>{`
        body {
          font-family: ${goodFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
