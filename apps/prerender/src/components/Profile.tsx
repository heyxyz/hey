import type { AnyPublication } from '@lenster/lens';
import { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatarUrl from '@lenster/lib/getAvatarUrl';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
import truncateByWords from '@lenster/lib/truncateByWords';
import type { FC } from 'react';
import { JsonLd } from 'react-schemaorg';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import SinglePublication from './Shared/SinglePublication';
import Tags from './Shared/Tags';

interface ProfileProps {
  profile: Profile;
  publications: AnyPublication[];
}

const Profile: FC<ProfileProps> = ({ profile, publications }) => {
  if (!profile) {
    return <DefaultTags />;
  }

  const title = profile.metadata?.displayName
    ? `${profile.metadata.displayName} (@${profile?.handle}) • Lenster`
    : `@${profile?.handle} • Lenster`;
  const description = truncateByWords(profile.metadata?.bio ?? '', 30);
  const image = sanitizeDStorageUrl(getAvatarUrl(profile));

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
                description: profile.metadata?.bio,
                givenName: profile.metadata?.displayName ?? profile.handle,
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
                    userInteractionCount: profile.stats.followers
                  },
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/SubscribeAction',
                    name: 'Following',
                    userInteractionCount: profile.stats.following
                  },
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/WriteAction',
                    name: 'Posts',
                    userInteractionCount: profile.stats.posts
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
        <h1 data-testid="profile-name">
          {profile.metadata?.displayName ?? profile.handle}
        </h1>
        <h2 data-testid="profile-handle">@{formatHandle(profile.handle)}</h2>
        <h3 data-testid="profile-bio">
          {truncateByWords(profile.metadata?.bio ?? '', 30)}
        </h3>
        <div>
          <div>{profile.stats.posts} Posts</div>
          <div>{profile.stats.comments} Replies</div>
          <div>{profile.stats.following} Following</div>
          <div>{profile.stats.followers} Followers</div>
          <div>{profile.stats.mirrors} Mirrors</div>
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
            <a
              href={`${BASE_URL}/u/${formatHandle(
                profile.handle
              )}?type=gallery`}
            >
              Gallery
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
                  ? publication.mirrorOn.id
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
