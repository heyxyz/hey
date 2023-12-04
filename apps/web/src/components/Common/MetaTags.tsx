import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@hey/data/constants';
import Head from 'next/head';
import { type FC } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
}

const MetaTags: FC<MetaTagsProps> = ({
  title = APP_NAME,
  description = DESCRIPTION
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      />
      <link rel="canonical" href="https://hey.xyz" />

      <meta property="og:url" content="https://hey.xyz" />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_OG} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:site" content={APP_NAME} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={DEFAULT_OG} />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="heydotxyz" />

      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="/opensearch.xml"
        title={APP_NAME}
      />

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
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};

export default MetaTags;
