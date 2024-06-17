import type { AppProps } from 'next/app';

import Providers from '@components/Common/Providers';
import Navbar from '@components/Shared/Navbar';
import { GridItemTwo, GridLayout } from '@good/ui';
import { GridItemTen } from '@good/ui/src/GridLayout';
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
      <GridLayout>
        <GridItemTwo>
          <Navbar />
        </GridItemTwo>
        <GridItemTen>
          <Component {...pageProps} />
        </GridItemTen>
      </GridLayout>
    </Providers>
  );
};

export default App;
