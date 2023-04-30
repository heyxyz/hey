import Document, { Head, Html, Main, NextScript } from 'next/document';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Prefetch and Preconnect */}
          <link rel="preconnect" href="https://user-content.lenster.xyz" />
          <link rel="dns-prefetch" href="https://user-content.lenster.xyz" />
          <link rel="preconnect" href="https://static-assets.lenster.xyz" />
          <link rel="dns-prefetch" href="https://static-assets.lenster.xyz" />

          {/* Misc */}
          <meta name="application-name" content="Lenster" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Lenster" />
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
