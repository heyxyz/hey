import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Prefetch and Preconnect */}
          <link rel="preconnect" href="https://media.lenster.xyz" />
          <link rel="dns-prefetch" href="https://media.lenster.xyz" />
          <link rel="preconnect" href="https://assets.lenster.xyz" />
          <link rel="dns-prefetch" href="https://assets.lenster.xyz" />

          {/* PWA */}
          <link rel="manifest" href="/manifest.json" />
          <meta name="application-name" content="Lenster" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Lenster" />

          {/* Icons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

          {/* Simple Analytics */}
          <Script strategy="lazyOnload" id="sa-events">
            {`window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]};`}
          </Script>
          <Script strategy="lazyOnload" data-collect-dnt="true" src="https://sa.lenster.xyz/latest.js" />
          <noscript>
            <img
              src="https://sa.lenster.xyz/noscript.gif"
              alt=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LensterDocument;
