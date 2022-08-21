import '../styles.css';

import SiteLayout from '@components/SiteLayout';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

const Provider = dynamic(() => import('./Provider'));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </Provider>
  );
};

export default App;
