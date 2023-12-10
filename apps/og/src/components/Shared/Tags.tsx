import type { FC } from 'react';

import { APP_NAME } from '@hey/data/constants';
import Head from 'next/head';

interface TagsProps {
  cardType?: 'summary_large_image' | 'summary';
  description: string;
  image: string;
  publishedTime?: string;
  schema?: any;
  title: string;
  url: string;
}

const Tags: FC<TagsProps> = ({
  cardType = 'summary',
  description,
  image,
  publishedTime,
  schema,
  title,
  url
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta content="en" httpEquiv="content-language" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content={description} name="description" />
      <link href={url} rel="canonical" />
      {/* General OG */}
      <meta content={url} property="og:url" />
      <meta content={APP_NAME} property="og:site_name" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={image} property="og:image" />
      <meta content="512" property="og:image:width" />
      <meta content="512" property="og:image:height" />
      <meta content="article" property="og:type" />
      {/* Twitter OG */}
      <meta content={cardType} property="twitter:card" />
      <meta content={APP_NAME} property="twitter:site" />
      <meta content={title} property="twitter:title" />
      <meta content={description} property="twitter:description" />
      <meta content={image} property="twitter:image" />
      <meta content="400" property="twitter:image:width" />
      <meta content="400" property="twitter:image:height" />
      <meta content="heydotxyz" property="twitter:creator" />
      {/* Lens OG */}
      <meta content={cardType} property="lens:card" />
      <meta content={APP_NAME} property="lens:site" />
      <meta content={title} property="lens:title" />
      <meta content={description} property="lens:description" />
      <meta content={image} property="lens:image" />
      {publishedTime ? (
        <meta content={publishedTime} property="article:published_time" />
      ) : null}
      {schema ? schema : null}
    </Head>
  );
};

export default Tags;
