import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import { OG_MEDIA_PROXY_URL } from 'data/constants';
import { Publication } from 'lens';
import type { FC } from 'react';

import DefaultTags from './Shared/DefaultTags';
import Tags from './Shared/Tags';

interface Props {
  publication: Publication;
}

const Publication: FC<Props> = ({ publication }) => {
  if (!publication) {
    return <DefaultTags />;
  }

  const hasMedia = publication.metadata?.media.length;
  const profile: any =
    publication?.__typename === 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile;

  const title = `${publication?.__typename === 'Post' ? 'Post' : 'Comment'} by @${profile.handle} • Lenster`;
  const description = publication.metadata?.content ?? '';
  const image = hasMedia
    ? getIPFSLink(publication.metadata?.media[0].original.url)
    : profile
    ? `${OG_MEDIA_PROXY_URL}/tr:n-avatar,tr:di-placeholder.webp/${getIPFSLink(
        profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
      )}`
    : 'https://assets.lenster.xyz/images/og/logo.jpeg';

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        cardType={hasMedia ? 'summary_large_image' : 'summary'}
      />
      <div>{title}</div>
    </>
  );
};

export default Publication;
