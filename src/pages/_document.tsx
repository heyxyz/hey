import HexagonClipConfig from '@components/Shared/HexagonClipConfig';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <HexagonClipConfig />
        </body>
      </Html>
    );
  }
}

export default LensterDocument;
