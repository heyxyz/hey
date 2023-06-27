import '../styles.css';

import circluarStd from '@lib/lensterFont';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const Providers = dynamic(() => import('@components/Common/Providers'), {
  ssr: false
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
      {/* Begin Simple Analytics */}
      <Script strategy="lazyOnload" id="sa-script">
        {`window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]};`}
      </Script>
      <Script
        strategy="lazyOnload"
        data-collect-dnt="true"
        src="https://leafwatch.lenster.xyz/latest.js"
      />
      <noscript>
        <img
          src="https://leafwatch.lenster.xyz/noscript.gif"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
      {/* End Simple Analytics */}
    </Providers>
  );
};

export default App;
