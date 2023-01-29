import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import { OG_MEDIA_PROXY_URL } from 'data/constants';
import type { MediaSet, NftImage } from 'lens';
import { Profile } from 'lens';
import type { FC } from 'react';

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
    ? `${OG_MEDIA_PROXY_URL}/tr:n-avatar,tr:di-placeholder.webp/${getIPFSLink(
        profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
      )}`
    : 'https://assets.lenster.xyz/images/og/logo.jpeg';

  return (
    <>
      <Tags title={title} description={description} image={image} />
      <div>{title}</div>
    </>
  );
};

export default Profile;
