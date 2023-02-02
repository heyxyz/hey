import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import { DEFAULT_OG, MEDIA_PROXY_URL } from 'data/constants';
import type { MediaSet, NftImage } from 'lens';
import { Profile } from 'lens';
import type { FC } from 'react';
import { JsonLd } from 'react-schemaorg';

import DefaultTags from './Shared/DefaultTags';
import Tags from './Shared/Tags';

interface Props {
  profile: Profile & { picture: MediaSet & NftImage };
}

const Profile: FC<Props> = ({ profile }) => {
  if (!profile) {
    return <DefaultTags />;
  }

  const title = profile?.name
    ? `${profile?.name} (@${profile?.handle}) • Lenster`
    : `@${profile?.handle} • Lenster`;
  const description = profile?.bio ?? '';
  const image = profile
    ? `${MEDIA_PROXY_URL}/?name=avatar&image=${getIPFSLink(
        profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
      )}`
    : DEFAULT_OG;

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
      <div>{title}</div>
    </>
  );
};

export default Profile;
