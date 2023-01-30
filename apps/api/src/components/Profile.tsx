import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import { DEFAULT_OG, IMAGE_PROXY_URL } from 'data/constants';
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
    ? `${IMAGE_PROXY_URL}/?name=avatar&image=${getIPFSLink(
        profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
      )}`
    : DEFAULT_OG;

  return (
    <>
      <Tags title={title} description={description} image={image} />
      <div>{title}</div>
    </>
  );
};

export default Profile;
