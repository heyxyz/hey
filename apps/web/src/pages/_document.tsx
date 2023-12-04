import Document, { Head, Html, Main, NextScript } from 'next/document';

class HeyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

          {/* Prefetch and Preconnect */}
          <link href="https://hey-assets.b-cdn.net" rel="preconnect" />
          <link href="https://hey-assets.b-cdn.net" rel="dns-prefetch" />

          {/* Icons */}
          <link href="/ati.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/16x16.png" rel="icon" sizes="16x16" type="image/png" />

          {/* PWA config */}
          <link href="/manifest.json" rel="manifest" />
          <meta content="Hey" name="application-name" />
          <meta content="Hey" name="apple-mobile-web-app-title" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta
            content="default"
            name="apple-mobile-web-app-status-bar-style"
          />
          <meta content="#ffffff" name="theme-color" />
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
