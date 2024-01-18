import type { AnyPublication } from '@hey/lens';
import type { Metadata } from 'next';

import { APP_NAME } from '@hey/data/constants';
import { PublicationDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
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
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const assetIsImage = filteredAsset?.type === 'Image';
  const assetIsVideo = filteredAsset?.type === 'Video';
  const assetIsAudio = filteredAsset?.type === 'Audio';

  const getOGImages = () => {
    if (assetIsImage) {
      if (filteredAttachments.length > 0) {
        return filteredAttachments.map((attachment) => attachment.uri);
      }

      return [filteredAsset?.uri];
    }

    if (assetIsVideo) {
      if (filteredAttachments.length > 0) {
        return filteredAttachments.map((attachment) => attachment.uri);
      }

      return [filteredAsset?.cover];
    }

    if (assetIsAudio) {
      if (filteredAttachments.length > 0) {
        return filteredAttachments.map((attachment) => attachment.uri);
      }

      return [filteredAsset?.cover];
    }

    return [];
  };

  const { displayName, slugWithPrefix } = getProfile(profile);

  const title = `${targetPublication.__typename} by ${slugWithPrefix} • ${APP_NAME}`;

  return {
    alternates: {
      canonical: `https://hey.xyz/posts/${targetPublication.id}`
    },
    applicationName: APP_NAME,
    authors: {
      name: displayName,
      url: `https://hey.xyz/u/${profile.handle}`
    },
    creator: displayName,
    description: filteredContent,
    keywords: [
      'social media post',
      'social media',
      'hey',
      'lenster',
      'user post',
      'like',
      'share',
      'post',
      'publication',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz/posts/${targetPublication.id}`),
    openGraph: {
      images: getOGImages() as any,
      siteName: 'Hey',
      type: 'article'
    },
    publisher: displayName,
    title: title,
    twitter: {
      card: assetIsAudio ? 'summary' : 'summary_large_image',
      site: '@heydotxyz'
    }
  };
}

export default function Page({ params }: Props) {
  return <div>{params.id}</div>;
}
