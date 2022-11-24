import { IS_PRODUCTION } from 'data/constants';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />

          {/* Prefetch and Preconnect */}
          <link rel="preconnect" href="https://media.lenster.xyz" />
          <link rel="dns-prefetch" href="https://media.lenster.xyz" />
          <link rel="preconnect" href="https://assets.lenster.xyz" />
          <link rel="dns-prefetch" href="https://assets.lenster.xyz" />

          {/* Mobile settings */}
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {/* Icons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          {IS_PRODUCTION ? (
            <Script
              strategy="lazyOnload"
              data-website-id="d85fe26e-625b-4973-abd1-5dd8fdc4782f"
              src="https://umami.lenster.xyz/umami.js"
            />
          ) : null}
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
