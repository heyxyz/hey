import type { AppProps } from 'next/app';

import Providers from '@components/Common/Providers';
import { heyFont } from '@helpers/fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
      <SpeedInsights sampleRate={0.5} />
    </Providers>
  );
};

export default App;
