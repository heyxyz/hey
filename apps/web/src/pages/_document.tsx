import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

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

          {/* Simple Analytics */}
          <Script
            async
            src="https://scripts.simpleanalyticscdn.com/latest.js"
          />
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
