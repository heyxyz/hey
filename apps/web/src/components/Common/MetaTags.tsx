import type { FC } from 'react';

import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@good/data/constants';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface MetaTagsProps {
  creator?: string;
  description?: string;
  title?: string;
}

const MetaTags: FC<MetaTagsProps> = ({
  creator,
  description = DESCRIPTION,
  title = APP_NAME
}) => {
  const { asPath } = useRouter();
  const url = `https://bcharity.net${asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name="description" />
      <meta
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        name="viewport"
      />
      <meta
        content="goodcast,bcharity.net,social media profile,social media,lenster,user profile,lens,lens protocol,decentralized,web3,Yoginth,@yoginth"
        name="keywords"
      />
      <link href={url} rel="canonical" />

      <meta content={url} property="og:url" />
      <meta content={APP_NAME} property="og:site_name" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={DEFAULT_OG} property="og:image" />

      <meta content="summary_large_image" property="twitter:card" />
      <meta content={APP_NAME} property="twitter:site" />
      <meta content={title} property="twitter:title" />
      <meta content={description} property="twitter:description" />
      <meta content={DEFAULT_OG} property="twitter:image" />
      <meta content="400" property="twitter:image:width" />
      <meta content="400" property="twitter:image:height" />
      <meta content="bcharityfi" property="twitter:creator" />

      {creator ? (
        <>
          <meta content={creator} property="creator" />
          <meta content={creator} property="publisher" />
        </>
      ) : null}

      <link
        href="/opensearch.xml"
        rel="search"
        title={APP_NAME}
        type="application/opensearchdescription+xml"
      />

      {/* Prefetch and Preconnect */}
      <link href="https://good-assets.b-cdn.net" rel="preconnect" />
      <link href="https://good-assets.b-cdn.net" rel="dns-prefetch" />

      {/* Icons */}
      <link href="/ati.png" rel="apple-touch-icon" sizes="180x180" />
      <link href="/32x32.png" rel="icon" sizes="32x32" type="image/png" />
      <link href="/16x16.png" rel="icon" sizes="16x16" type="image/png" />

      {/* PWA config */}
      <link href="/manifest.json" rel="manifest" />
      <meta content="Good" name="application-name" />
      <meta content="Good" name="apple-mobile-web-app-title" />
      <meta content="yes" name="mobile-web-app-capable" />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="default" name="apple-mobile-web-app-status-bar-style" />
      <meta content="#ffffff" name="theme-color" />
    </Head>
  );
};

export default MetaTags;
