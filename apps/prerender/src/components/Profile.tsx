import { AVATAR, USER_CONTENT_URL } from 'data/constants';
import type { MediaSet, NftImage, Publication } from 'lens';
import { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getStampFyiURL from 'lib/getStampFyiURL';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import { JsonLd } from 'react-schemaorg';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import Tags from './Shared/Tags';

interface ProfileProps {
  profile: Profile & { picture: MediaSet & NftImage };
  publications: Publication[];
}

const Profile: FC<ProfileProps> = ({ profile, publications }) => {
  if (!profile) {
    return <DefaultTags />;
  }

  const title = profile?.name
    ? `${profile?.name} (@${profile?.handle}) • Lenster`
    : `@${profile?.handle} • Lenster`;
  const description = profile?.bio ?? '';
  const image = `${USER_CONTENT_URL}/${AVATAR}/${sanitizeDStorageUrl(
    profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
  )}`;

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        schema={
          <JsonLd<any>
            item={{
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              author: {
                '@type': 'Person',
                additionalName: profile.handle,
                description: profile.bio,
                givenName: profile.name ?? profile.handle,
                identifier: profile.id,
                image: {
                  '@type': 'ImageObject',
                  contentUrl: image,
                  thumbnailUrl: image
                },
                interactionStatistic: [
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/FollowAction',
                    name: 'Follows',
                    userInteractionCount: profile.stats.totalFollowers
                  },
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/SubscribeAction',
                    name: 'Following',
                    userInteractionCount: profile.stats.totalFollowing
                  },
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/WriteAction',
                    name: 'Posts',
                    userInteractionCount: profile.stats.totalPosts
                  }
                ],
                url: `https://lenster.xyz/u/${profile.handle}}`
              }
            }}
          />
        }
      />
      <header>
        <img alt={`@${formatHandle(profile.handle)}'s avatar`} src={image} width="64" />
        <h1 data-testid="name">{profile.name ?? profile.handle}</h1>
        <h2 data-testis="handle">@{formatHandle(profile.handle)}</h2>
        <div>
          <div>{profile.stats.totalPosts} Posts</div>
          <div>{profile.stats.totalComments} Replies</div>
          <div>{profile.stats.totalFollowing} Following</div>
          <div>{profile.stats.totalFollowers} Followers</div>
        </div>
        <hr />
        <nav>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>Feed</a>
          </div>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}?type=replies`}>Replies</a>
          </div>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}?type=media`}>Media</a>
          </div>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}?type=collects`}>Collected</a>
          </div>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}?type=nft`}>NFTs</a>
          </div>
        </nav>
        <hr />
      </header>
      <div>
        {publications?.map((publication) => {
          const { stats, metadata } = publication;
          const isMirror = publication.__typename === 'Mirror';
          const publicationId = isMirror ? publication.mirrorOf.id : publication.id;
          const publicationProfile = (
            isMirror ? publication?.mirrorOf?.profile : publication?.profile
          ) as Profile & { picture: MediaSet & NftImage };
          const publicationProfileAvatar = `${USER_CONTENT_URL}/${AVATAR}/${sanitizeDStorageUrl(
            publicationProfile.picture?.original?.url ??
              publicationProfile.picture?.uri ??
              getStampFyiURL(profile?.ownedBy)
          )}`;
          return (
            <div key={publicationId}>
              <div>
                <a href={`${BASE_URL}/u/${formatHandle(publicationProfile.handle)}`}>
                  <img
                    alt={`@${formatHandle(publicationProfile.handle)}'s avatar`}
                    src={publicationProfileAvatar}
                    width="64"
                  />
                </a>
              </div>
              <div>
                <div>
                  <a href={`${BASE_URL}/u/${formatHandle(publicationProfile.handle)}`}>
                    {publicationProfile.name ?? publicationProfile.handle}
                  </a>
                </div>
                <div>
                  <a href={`${BASE_URL}/u/${formatHandle(publicationProfile.handle)}`}>
                    @{formatHandle(publicationProfile.handle)}
                  </a>
                </div>
                <div>
                  <a href={`${BASE_URL}/posts/${publicationId}`}>{metadata.content ?? ''}</a>
                </div>
              </div>
              <div>
                <div>
                  {isMirror ? publication.mirrorOf.stats.totalAmountOfComments : stats.totalAmountOfComments}{' '}
                  Comments
                </div>
                <div>{isMirror ? publication.mirrorOf.stats.totalUpvotes : stats.totalUpvotes} Likes</div>
                {publication.collectModule.__typename !== 'RevertCollectModuleSettings' ? (
                  <div>
                    {isMirror
                      ? publication.mirrorOf.stats.totalAmountOfCollects
                      : stats.totalAmountOfCollects}{' '}
                    Collects
                  </div>
                ) : null}
                <div>
                  {isMirror ? publication.mirrorOf.stats.totalAmountOfMirrors : stats.totalAmountOfMirrors}{' '}
                  Mirrors
                </div>
                <hr />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Profile;
