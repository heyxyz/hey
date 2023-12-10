import type { AnyPublication, Comment } from '@hey/lens';
import type { FC } from 'react';

import { APP_NAME, DEFAULT_OG } from '@hey/data/constants';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import SinglePublication from './Shared/SinglePublication';
import Tags from './Shared/Tags';

interface PublicationProps {
  comments: Comment[];
  publication: AnyPublication;
}

const Publication: FC<PublicationProps> = ({ comments, publication }) => {
  if (!publication) {
    return <DefaultTags />;
  }

  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;

  const { metadata } = targetPublication;

  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const media =
    filteredAsset?.uri || filteredAsset?.cover || filteredAttachments[0]?.uri;
  const profile = targetPublication.by;
  const title = `${targetPublication.__typename} by ${
    getProfile(targetPublication.by).slugWithPrefix
  } • ${APP_NAME}`;
  const description = truncateByWords(filteredContent, 30);
  const image = media
    ? sanitizeDStorageUrl(media)
    : profile
      ? getAvatar(profile)
      : DEFAULT_OG;

  return (
    <>
      <Tags
        cardType={media ? 'summary_large_image' : 'summary'}
        description={description}
        image={`/api/post/${publication.id}`}
        publishedTime={publication?.createdAt}
        title={title}
        url={`${BASE_URL}/posts/${publication.id}`}
      />
      <header>
        <SinglePublication h1Content publication={publication} />
      </header>
      <div>
        {comments?.map((comment) => (
          <div key={comment.id}>
            <SinglePublication publication={comment} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Publication;
