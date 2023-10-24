import { APP_NAME } from '@hey/data/constants';
import type { AnyPublication } from '@hey/lens';
import { Profile } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import truncateByWords from '@hey/lib/truncateByWords';
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

  const title = `${getProfile(profile).displayName} (${
    getProfile(profile).slugWithPrefix
  }) • ${APP_NAME}`;
  const description = truncateByWords(profile.metadata?.bio ?? '', 30);
  const image = getAvatar(profile);

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        url={`${BASE_URL}${getProfile(profile).link}`}
        schema={
          <JsonLd<any>
            item={{
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              author: {
                '@type': 'Person',
                additionalName: getProfile(profile).slug,
                description: profile.metadata?.bio,
                givenName: getProfile(profile).displayName,
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
                url: `https://hey.xyz/${getProfile(profile).slug}}`
              }
            }}
          />
        }
      />
      <header>
        <img
          alt={`${getProfile(profile).slugWithPrefix}'s avatar`}
          src={image}
          width="64"
        />
        <h1>{getProfile(profile).displayName}</h1>
        <h2>{getProfile(profile).slugWithPrefix}</h2>
        <h3>{truncateByWords(profile.metadata?.bio ?? '', 30)}</h3>
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
            <a href={`${BASE_URL}${getProfile(profile).link}`}>Feed</a>
          </div>
          <div>
            <a href={`${BASE_URL}${getProfile(profile).link}?type=replies`}>
              Replies
            </a>
          </div>
          <div>
            <a href={`${BASE_URL}${getProfile(profile).link}?type=media`}>
              Media
            </a>
          </div>
          <div>
            <a href={`${BASE_URL}${getProfile(profile).link}?type=collects`}>
              Collected
            </a>
          </div>
          <div>
            <a href={`${BASE_URL}${getProfile(profile).link}?type=gallery`}>
              Gallery
            </a>
          </div>
        </nav>
        <hr />
      </header>
      <div>
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
