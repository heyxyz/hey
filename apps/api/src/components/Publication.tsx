import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import { DEFAULT_OG, IMAGE_PROXY_URL } from 'data/constants';
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
    ? `${IMAGE_PROXY_URL}/?name=avatar&image=${getIPFSLink(
        profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
      )}`
    : DEFAULT_OG;

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
