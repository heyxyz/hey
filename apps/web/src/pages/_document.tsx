import PageHead from '@components/Common/Head';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class HeyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <PageHead />
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
