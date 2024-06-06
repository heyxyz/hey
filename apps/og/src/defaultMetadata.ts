import type { Metadata } from 'next';

import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@good/data/constants';

const defaultMetadata: Metadata = {
  alternates: { canonical: 'https://bcharity.net' },
  applicationName: APP_NAME,
  description: DESCRIPTION,
  keywords: [
    'good',
    'bcharity.net',
    'social media',
    'lenster',
    'polygon',
    'lens',
    'lens protocol',
    'decentralized',
    'web3'
  ],
  metadataBase: new URL(`https://bcharity.net`),
  openGraph: {
    images: [DEFAULT_OG],
    siteName: 'Good',
    type: 'website'
  },
  title: APP_NAME,
  twitter: { card: 'summary_large_image', site: '@gooddotxyz' }
};

export default defaultMetadata;
