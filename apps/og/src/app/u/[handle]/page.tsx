import type { Profile } from '@hey/lens';
import type { Metadata } from 'next';

import { APP_NAME, HANDLE_PREFIX } from '@hey/data/constants';
import getAvatar from '@hey/helpers/getAvatar';
import getProfile from '@hey/helpers/getProfile';
import logger from '@hey/helpers/logger';
import { ProfileDocument } from '@hey/lens';
import { print } from 'graphql';
import defaultMetadata from 'src/defaultMetadata';

interface Props {
  params: { handle: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params;

  const response = await fetch('https://api-v2.lens.dev', {
    body: JSON.stringify({
      operationName: 'Profile',
      query: print(ProfileDocument),
      variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
    }),
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  });

  const data = await response.json();

  if (!data.data.profile) {
    return defaultMetadata;
  }

  const profile = data.data.profile as Profile;
  const { displayName, link, slugWithPrefix } = getProfile(profile);
  const title = `${displayName} (${slugWithPrefix}) • ${APP_NAME}`;
  const description = (profile?.metadata?.bio || title).slice(0, 155);

  return {
    alternates: { canonical: `https://hey.xyz${link}` },
    applicationName: APP_NAME,
    creator: displayName,
    description: description,
    keywords: [
      'hey',
      'hey.xyz',
      'social media profile',
      'social media',
      'lenster',
      'polygon',
      'user profile',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz${link}`),
    openGraph: {
      description: description,
      images: [getAvatar(profile)],
      siteName: 'Hey',
      type: 'profile',
      url: `https://hey.xyz${link}`
    },
    other: {
      'count:followers': profile.stats.followers,
      'count:following': profile.stats.following,
      'lens:handle': handle,
      'lens:id': profile.id
    },
    publisher: displayName,
    title: title,
    twitter: { card: 'summary', site: '@heydotxyz' }
  };
}

export default async function Page({ params }: Props) {
  const metadata = await generateMetadata({ params });

  if (!metadata) {
    return <h1>{params.handle}</h1>;
  }

  const profileUrl = `https://hey.xyz/u/${metadata.other?.['lens:handle']}`;

  logger.info(`[OG] Fetched profile /u/${params.handle}`);

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>
            <a href={`${profileUrl}/following`}>
              Following: {metadata.other?.['count:following']}
            </a>
          </li>
          <li>
            <a href={`${profileUrl}/followers`}>
              Followers: {metadata.other?.['count:followers']}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
