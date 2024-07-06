import type { AppProps } from 'next/app';

import Providers from '@components/Common/Providers';
import { heyFont } from '@helpers/fonts';
import pushWebVitalsToLeafwatch from '@helpers/pushWebVitalsToLeafwatch';
import { useReportWebVitals } from 'next/web-vitals';

import '../styles.css';

const App = ({ Component, pageProps }: AppProps) => {
  useReportWebVitals((metric) => pushWebVitalsToLeafwatch(metric));

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
