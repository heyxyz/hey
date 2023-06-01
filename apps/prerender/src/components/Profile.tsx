import type { MediaSet, NftImage, Publication } from '@lenster/lens';
import { Profile } from '@lenster/lens';
import formatHandle from 'lib/formatHandle';
import getStampFyiURL from 'lib/getStampFyiURL';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import truncateByWords from 'lib/truncateByWords';
import type { FC } from 'react';
import { JsonLd } from 'react-schemaorg';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import SinglePublication from './Shared/SinglePublication';
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
  const description = truncateByWords(profile?.bio ?? '', 30);
  const image = sanitizeDStorageUrl(
    profile?.picture?.original?.url ??
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy)
  );

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        url={`${BASE_URL}/u/${formatHandle(profile.handle)}`}
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
        <img
          alt={`@${formatHandle(profile.handle)}'s avatar`}
          src={image}
          width="64"
        />
        <h1 data-testid="profile-name">{profile.name ?? profile.handle}</h1>
        <h2 data-testid="profile-handle">@{formatHandle(profile.handle)}</h2>
        <h3 data-testid="profile-bio">
          {truncateByWords(profile?.bio ?? '', 30)}
        </h3>
        <div>
          <div>{profile.stats.totalPosts} Posts</div>
          <div>{profile.stats.totalComments} Replies</div>
          <div>{profile.stats.totalFollowing} Following</div>
          <div>{profile.stats.totalFollowers} Followers</div>
          <div>{profile.stats.totalMirrors} Mirrors</div>
        </div>
        <hr />
        <nav>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>Feed</a>
          </div>
          <div>
            <a
              href={`${BASE_URL}/u/${formatHandle(
                profile.handle
              )}?type=replies`}
            >
              Replies
            </a>
          </div>
          <div>
            <a
              href={`${BASE_URL}/u/${formatHandle(profile.handle)}?type=media`}
            >
              Media
            </a>
          </div>
          <div>
            <a
              href={`${BASE_URL}/u/${formatHandle(
                profile.handle
              )}?type=collects`}
            >
              Collected
            </a>
          </div>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}?type=nft`}>
              NFTs
            </a>
          </div>
        </nav>
        <hr />
      </header>
      <div data-testid="profile-feed">
        {publications?.map((publication) => {
          const { __typename } = publication;
          return (
            <div
              key={
                __typename === 'Mirror'
                  ? publication.mirrorOf.id
                  : publication.id
              }
            >
              <SinglePublication publication={publication} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Profile;
