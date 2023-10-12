import type { AnyPublication } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getAvatarUrl from '@hey/lib/getAvatarUrl';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

interface PublicationProps {
  publication: AnyPublication;
  h1Content?: boolean;
}

const SinglePublication: FC<PublicationProps> = ({
  publication,
  h1Content = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { stats, metadata } = targetPublication;
  const hasMedia = metadata?.media.length;
  const profile = targetPublication.by;
  const publicationId = targetPublication.id;
  const avatar = sanitizeDStorageUrl(getAvatarUrl(profile));
  const attachment = hasMedia
    ? sanitizeDStorageUrl(metadata?.media[0].original.url)
    : null;
  const content = truncateByWords(metadata?.marketplace?.description, 30);

  // Stats
  const commentsCount = stats.comments;
  const likesCount = stats.reactions;
  const collectsCount = stats.countOpenActions;
  const mirrorsCount = stats.mirrors;

  return (
    <>
      <div>
        <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>
          <img
            alt={`@${formatHandle(profile.handle)}'s avatar`}
            src={avatar}
            width="64"
          />
        </a>
      </div>
      <div data-testid={`publication-${publicationId}`}>
        <div>
          <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>
            {profile.metadata?.displayName ?? profile.handle}
          </a>
        </div>
        <div>
          <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>
            @{formatHandle(profile.handle)}
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
          <div>
            <img alt="attachment" src={attachment} width="500" />
          </div>
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
