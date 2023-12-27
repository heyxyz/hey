import type { AnyPublication } from '@hey/lens';
import type { Metadata } from 'next';

import { APP_NAME } from '@hey/data/constants';
import { PublicationDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import getPublicationData from '@hey/lib/getPublicationData';
import logger from '@hey/lib/logger';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { headers } from 'next/headers';
import defaultMetadata from 'src/defaultMetadata';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const agent = headersList.get('user-agent');
  logger.info(`OG request from ${agent} for Publication:${params.id}`);

  const { id } = params;
  const { data } = await apolloClient().query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  });

  if (!data.publication) {
    return defaultMetadata;
  }

  const publication = data.publication as AnyPublication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { by: profile, metadata } = targetPublication;
  const filteredContent = getPublicationData(metadata)?.content || '';

  const title = `${targetPublication.__typename} by ${
    getProfile(profile).slugWithPrefix
  } • ${APP_NAME}`;

  return {
    description: filteredContent,
    metadataBase: new URL(`https://hey.xyz/posts/${targetPublication.id}`),
    openGraph: {
      images: [getAvatar(profile)],
      siteName: 'Hey',
      type: 'article'
    },
    title: title,
    twitter: { card: 'summary' }
  };
}

export default function Page({ params }: Props) {
  return <div>{params.id}</div>;
}
