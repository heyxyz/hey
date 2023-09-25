import { APP_NAME, DEFAULT_OG } from '@hey/data/constants';
import type { Comment } from '@hey/lens';
import { Publication } from '@hey/lens';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import SinglePublication from './Shared/SinglePublication';
import Tags from './Shared/Tags';

interface PublicationProps {
  publication: Publication;
  comments: Comment[];
}

const Publication: FC<PublicationProps> = ({ publication, comments }) => {
  if (!publication) {
    return <DefaultTags />;
  }

  const { metadata, __typename } = publication;
  const hasMedia = metadata?.media.length;
  const profile: any =
    __typename === 'Mirror'
      ? publication?.mirrorOf?.profile
      : publication.profile;
  const title = `${
    __typename === 'Post'
      ? 'Post'
      : __typename === 'Mirror'
      ? 'Mirror'
      : 'Comment'
  } by @${publication.profile.handle} • ${APP_NAME}`;
  const description = truncateByWords(metadata?.content, 30);
  const image = hasMedia
    ? sanitizeDStorageUrl(metadata?.media[0].original.url)
    : profile
    ? sanitizeDStorageUrl(
        profile?.picture?.original?.url ??
          profile?.picture?.uri ??
          getStampFyiURL(profile?.ownedBy)
      )
    : DEFAULT_OG;

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        publishedTime={publication?.createdAt}
        cardType={hasMedia ? 'summary_large_image' : 'summary'}
        url={`${BASE_URL}/posts/${publication.id}`}
      />
      <header>
        <SinglePublication publication={publication} h1Content />
      </header>
      <div data-testid="comment-feed">
        {comments?.map((comment) => {
          const { id } = comment;
          return (
            <div key={id}>
              <SinglePublication publication={comment} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Publication;
