import Document, { Head, Html, Main, NextScript } from 'next/document';

class HeyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Prefetch and Preconnect */}
          <link rel="preconnect" href="https://hey-assets.b-cdn.net" />
          <link rel="dns-prefetch" href="https://hey-assets.b-cdn.net" />

          {/* Icons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/ati.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/16x16.png" />

          {/* PWA config */}
          <link rel="manifest" href="/manifest.json" />
          <meta name="application-name" content="Hey" />
          <meta name="apple-mobile-web-app-title" content="Hey" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default HeyDocument;
