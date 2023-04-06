import Head from 'next/head';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

interface TagsProps {
  title: string;
  description: string;
  image: string;
  cardType?: 'summary' | 'summary_large_image';
  schema?: any;
  canonical: string;
}

const Tags: FC<TagsProps> = ({ title, description, image, cardType = 'summary', schema, canonical }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:site_name" content="Lenster" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="twitter:card" content={cardType} />
      <meta property="twitter:site" content="Lenster" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image:src" content={image} />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="lensterxyz" />
      <link rel="canonical" href={canonical} />
      {schema ? schema : null}
    </Head>
  );
};

export default Tags;
