import type { DefaultSeoProps, NextSeoProps } from 'next-seo';

import { DefaultSeo, NextSeo } from 'next-seo';
import Head from 'next/head';
import * as React from 'react';

export interface Props extends NextSeoProps {
  description?: string;
  image?: string;
  title?: string;
}

const title = 'Railway OG Image Generator';
export const url = '';
const description = 'Service that generates dynamic OG images for railway.app';

// Generate OG image for itself
const image =
  'https://og.railway.app/api/image?fileType=png&layoutName=Railway&Theme=Dark&Title=Open+Graph%5CnImage+Generator&Sub+Title=og.railway.app';

const config: DefaultSeoProps = {
  description,
  openGraph: {
    images: [{ url: image }],
    site_name: title,
    type: 'website',
    url
  },
  title,
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Railway_App'
  }
};

export const SEO: React.FC<Props> = ({ image, ...props }) => {
  const title = props.title ?? config.title;
  const description = props.description || config.description;

  return (
    <>
      <DefaultSeo {...config} />

      <NextSeo
        {...props}
        {...(image == null
          ? {}
          : {
              openGraph: {
                images: [{ url: image }]
              }
            })}
      />

      <Head>
        <title>{title}</title>

        <meta content={description} name="description" />
      </Head>
    </>
  );
};
