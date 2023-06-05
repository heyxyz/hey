import Document, { Head, Html, Main, NextScript } from 'next/document';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Prefetch and Preconnect */}
          {/* <link rel="preconnect" href="https://user-content.lenster.xyz" />
          <link rel="dns-prefetch" href="https://user-content.lenster.xyz" />
          <link rel="preconnect" href="https://static-assets.lenster.xyz" />
          <link rel="dns-prefetch" href="https://static-assets.lenster.xyz" /> */}

          {/* Misc */}
          <meta name="application-name" content="Lineaster" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Lineaster" />

          {/* Icons */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon-dark.png"
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon-light.png"
            media="(prefers-color-scheme: dark)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/android-chrome-512x512-dark.png"
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/android-chrome-512x512-light.png"
            media="(prefers-color-scheme: dark)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-chrome-192x192-dark.png"
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-chrome-192x192-light.png"
            media="(prefers-color-scheme: dark)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32-dark.png"
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32-light.png"
            media="(prefers-color-scheme: dark)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16-dark.png"
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16-light.png"
            media="(prefers-color-scheme: dark)"
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

export default LensterDocument;
