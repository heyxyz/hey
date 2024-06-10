import type { AnyPublication } from '@good/lens';
import type { Metadata } from 'next';

import { APP_NAME } from '@good/data/constants';
import getProfile from '@good/helpers/getProfile';
import getPublicationData from '@good/helpers/getPublicationData';
import { isMirrorPublication } from '@good/helpers/publicationHelpers';
import {
  LimitType,
  PublicationDocument,
  PublicationsDocument
} from '@good/lens';
import { apolloClient } from '@good/lens/apollo';
import getCollectModuleMetadata from '@helpers/getCollectModuleMetadata';
import getPublicationOGImages from '@helpers/getPublicationOGImages';
import defaultMetadata from 'src/defaultMetadata';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  const filteredAsset = getPublicationData(metadata)?.asset;
  const assetIsAudio = filteredAsset?.type === 'Audio';

  const { displayName, link, slugWithPrefix } = getProfile(profile);
  const title = `${targetPublication.__typename} by ${slugWithPrefix} • ${APP_NAME}`;
  const description = (filteredContent || title).slice(0, 155);

  return {
    alternates: {
      canonical: `https://bcharity.net/posts/${targetPublication.id}`
    },
    applicationName: APP_NAME,
    authors: {
      name: displayName,
      url: `https://bcharity.net${link}`
    },
    creator: displayName,
    description: description,
    keywords: [
      'good',
      'bcharity.net',
      'social media post',
      'social media',
      'lenster',
      'polygon',
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
    metadataBase: new URL(`https://bcharity.net/posts/${targetPublication.id}`),
    openGraph: {
      description: description,
      images: getPublicationOGImages(metadata) as any,
      siteName: 'Good',
      type: 'article',
      url: `https://bcharity.net/posts/${targetPublication.id}`
    },
    other: {
      'count:actions': targetPublication.stats.countOpenActions,
      'count:comments': targetPublication.stats.comments,
      'count:likes': targetPublication.stats.reactions,
      'count:mirrors': targetPublication.stats.mirrors,
      'count:quotes': targetPublication.stats.quotes,
      'lens:id': targetPublication.id,
      ...getCollectModuleMetadata(targetPublication)
    },
    publisher: displayName,
    title: title,
    twitter: {
      card: assetIsAudio ? 'summary' : 'summary_large_image',
      site: '@gooddotxyz'
    }
  };
}

export default async function Page({ params }: Props) {
  const metadata = await generateMetadata({ params });
  const { data } = await apolloClient().query({
    query: PublicationsDocument,
    variables: {
      request: {
        limit: LimitType.Fifty,
        where: {
          commentOn: {
            id: metadata.other?.['lens:id'],
            ranking: { filter: 'RELEVANT' }
          }
        }
      }
    }
  });

  if (!metadata) {
    return <h1>{params.id}</h1>;
  }

  const postUrl = `https://bcharity.net/posts/${metadata.other?.['lens:id']}`;

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>
            <a href={`${postUrl}/collectors`}>
              Actions: {metadata.other?.['count:actions']}
            </a>
          </li>
          <li>Comments: {metadata.other?.['count:comments']}</li>
          <li>
            <a href={`${postUrl}/likes`}>
              Likes: {metadata.other?.['count:likes']}
            </a>
          </li>
          <li>
            <a href={`${postUrl}/mirrors`}>
              Mirrors: {metadata.other?.['count:mirrors']}
            </a>
          </li>
          <li>
            <a href={`${postUrl}/quotes`}>
              Quotes: {metadata.other?.['count:quotes']}
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3>Comments</h3>
        <ul>
          {data?.publications?.items?.map((publication: AnyPublication) => {
            const targetPublication = isMirrorPublication(publication)
              ? publication.mirrorOn
              : publication;
            const filteredContent =
              getPublicationData(targetPublication.metadata)?.content || '';

            return (
              <li key={publication.id}>
                <a href={`https://bcharity.net/posts/${publication.id}`}>
                  {filteredContent}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
