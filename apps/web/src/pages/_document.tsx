import { IS_PRODUCTION } from 'data/constants';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/favicon.ico" />
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
