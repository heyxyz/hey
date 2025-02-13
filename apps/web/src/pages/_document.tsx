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

          {/* Icons */}
          <link href="/ati.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/16x16.png" rel="icon" sizes="16x16" type="image/png" />

          {/* Umami Analytics */}
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="aa3b1679-7098-49f4-8843-58f5785bbd30"
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
