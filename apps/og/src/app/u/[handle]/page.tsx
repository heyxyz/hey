import type { Profile } from '@hey/lens';
import type { Metadata } from 'next';

import { APP_NAME, HANDLE_PREFIX } from '@hey/data/constants';
import { ProfileDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import logger from '@hey/lib/logger';
import { headers } from 'next/headers';
import defaultMetadata from 'src/defaultMetadata';

type Props = {
  params: { handle: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const agent = headersList.get('user-agent');
  logger.info(`OG request from ${agent} for Handle:${params.handle}`);

  const { handle } = params;
  const { data } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  if (!data.profile) {
    return defaultMetadata;
  }

  const profile = data.profile as Profile;
  const { displayName, link, slugWithPrefix } = getProfile(profile);

  const title = `${displayName} (${slugWithPrefix}) • ${APP_NAME}`;

  return {
    alternates: { canonical: `https://hey.xyz/${link}` },
    applicationName: APP_NAME,
    creator: displayName,
    description: profile?.metadata?.bio,
    keywords: [
      'hey',
      'hey.xyz',
      'social media profile',
      'social media',
      'lenster',
      'user profile',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz/u/${profile.handle}`),
    openGraph: {
      images: [getAvatar(profile)],
      siteName: 'Hey',
      type: 'profile'
    },
    publisher: displayName,
    title: title,
    twitter: { card: 'summary', site: '@heydotxyz' }
  };
}

export default function Page({ params }: Props) {
  return <div>{params.handle}</div>;
}
