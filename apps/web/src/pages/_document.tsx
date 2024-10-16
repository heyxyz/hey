import Document, { Head, Html, Main, NextScript } from "next/document";

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
