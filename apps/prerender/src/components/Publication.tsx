import { AVATAR, DEFAULT_OG, USER_CONTENT_URL } from 'data/constants';
import type { Comment } from 'lens';
import { Publication } from 'lens';
import getStampFyiURL from 'lib/getStampFyiURL';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';

import DefaultTags from './Shared/DefaultTags';
import Tags from './Shared/Tags';

interface PublicationProps {
  publication: Publication;
  comments: Comment[];
}

const Publication: FC<PublicationProps> = ({ publication, comments }) => {
  if (!publication) {
    return <DefaultTags />;
  }

  const hasMedia = publication.metadata?.media.length;
  const profile: any =
    publication?.__typename === 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile;

  const title = `${publication?.__typename === 'Post' ? 'Post' : 'Comment'} by @${profile.handle} • Lenster`;
  const description = publication.metadata?.content ?? '';
  const image = hasMedia
    ? sanitizeDStorageUrl(publication.metadata?.media[0].original.url)
    : profile
    ? `${USER_CONTENT_URL}/${AVATAR}/${sanitizeDStorageUrl(
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
