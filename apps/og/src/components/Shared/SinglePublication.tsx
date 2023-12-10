import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import { BASE_URL } from 'src/constants';

interface PublicationProps {
  h1Content?: boolean;
  publication: AnyPublication;
}

const SinglePublication: FC<PublicationProps> = ({
  h1Content = false,
  publication
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { metadata, stats } = targetPublication;

  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const media =
    filteredAsset?.uri || filteredAsset?.cover || filteredAttachments[0]?.uri;
  const mediaType = filteredAsset?.type || filteredAttachments[0]?.type;
  const isVideo = mediaType === 'Video';
  const isAudio = mediaType === 'Audio';
  const profile = targetPublication.by;
  const publicationId = targetPublication.id;
  const avatar = getAvatar(profile);
  const attachment = media ? sanitizeDStorageUrl(media) : null;
  const content = truncateByWords(filteredContent, 30);

  // Stats
  const commentsCount = stats.comments;
  const likesCount = stats.reactions;
  const mirrorsCount = stats.mirrors;

  return (
    <>
      <div>
        <a href={`${BASE_URL}${getProfile(profile).link}`}>
          <img
            alt={`${getProfile(profile).slugWithPrefix}'s avatar`}
            src={avatar}
            width="64"
          />
        </a>
      </div>
      <div>
        <div>
          <a href={`${BASE_URL}${getProfile(profile).link}`}>
            {getProfile(profile).displayName}
          </a>
        </div>
        <div>
          <a href={`${BASE_URL}${getProfile(profile).link}`}>
            {getProfile(profile).slugWithPrefix}
          </a>
        </div>
        {h1Content ? (
          <h1>
            <a href={`${BASE_URL}/posts/${publicationId}`}>{content ?? ''}</a>
          </h1>
        ) : (
          <div>
            <a href={`${BASE_URL}/posts/${publicationId}`}>{content ?? ''}</a>
          </div>
        )}
        {attachment ? (
          isVideo ? (
            <video src={attachment} />
          ) : isAudio ? (
            <audio src={attachment} />
          ) : (
            <img alt="attachment" src={attachment} width="500" />
          )
        ) : null}
      </div>
      <div>
        <div>{commentsCount} Comments</div>
        <div>{likesCount} Likes</div>
        <div>{mirrorsCount} Mirrors</div>
        <hr />
      </div>
    </>
  );
};

export default SinglePublication;
