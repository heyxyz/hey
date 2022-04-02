import Document, { Head, Html, Main, NextScript } from 'next/document'

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="/favicon.svg" />
          <link
            href="https://assets.lenster.xyz/css/font.css"
            rel="stylesheet"
          />
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "70834b17203045ecaaec6a90c4615ba9"}'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default LensterDocument
