import Head from 'next/head';
import { Fragment } from 'react';

import { defaultDescription, defaultTitle, profileLinks } from '../constants';

const SEO = ({
  author,
  canonical,
  children,
  description,
  faviconImage = `/static/favicon-image.jpg`,
  image = `/static/social-media-card.jpg`,
  pubDate,
  title
}: any) => {
  const Title = `${title ?? defaultTitle}`.trim();
  const Description = `${description ?? defaultDescription}`.trim();
  return (
    <Head>
      <meta
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
        name="viewport"
      />
      <title>{Title}</title>
      <meta content={Title} name="title" property="title" />
      <meta content={Title} name="og:title" property="og:title" />
      <meta content={Title} name="twitter:title" property="twitter:title" />
      <meta content={Description} name="description" property="description" />
      <meta
        content={Description}
        name="og:description"
        property="og:description"
      />
      <meta
        content={Description}
        name="twitter:description"
        property="twitter:description"
      />
      {canonical && (
        <meta content={canonical} name="og:url" property="og:url" />
      )}
      {canonical && (
        <meta content={canonical} name="twitter:url" property="twitter:url" />
      )}
      <link href={faviconImage} rel="icon" />
      <meta content={image} name="og:image" property="og:image" />
      <meta content={image} name="twitter:image" property="twitter:image" />
      {profileLinks && profileLinks['twitter'] && (
        <meta
          content={`@${
            profileLinks['twitter'].split('/')[
              profileLinks['twitter'].split('/').length - 1
            ]
          }`}
          name="twitter:creator"
        />
      )}
      {pubDate && (
        <Fragment>
          <meta
            content={`${new Date(pubDate).toISOString()}`}
            property="article:published_time"
          />
          <meta content="article" property="og:type" />
        </Fragment>
      )}
      {canonical && <link href={canonical} rel="canonical" />}
      {author && <meta content={author} name="author" />}
      {children}
    </Head>
  );
};

export default SEO;
