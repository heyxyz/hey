import type { Metadata } from 'next';

import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@hey/data/constants';

const defaultMetadata: Metadata = {
  description: DESCRIPTION,
  metadataBase: new URL(`https://hey.xyz`),
  openGraph: {
    images: [DEFAULT_OG],
    siteName: 'Hey',
    type: 'website'
  },
  title: APP_NAME,
  twitter: { card: 'summary_large_image', site: '@heydotxyz' }
};

export default defaultMetadata;
