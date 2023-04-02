import { AVATAR, USER_CONTENT_URL } from 'data/constants';
import type { Publication } from 'lens';
import formatHandle from 'lib/formatHandle';
import getStampFyiURL from 'lib/getStampFyiURL';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

interface PublicationProps {
  publication: Publication;
  h1Content?: boolean;
}

const SinglePublication: FC<PublicationProps> = ({ publication, h1Content = false }) => {
  const { id, stats, metadata, __typename } = publication;
  const hasMedia = metadata?.media.length;
  const isMirror = __typename === 'Mirror';
  const profile: any = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const publicationId = isMirror ? publication?.mirrorOf?.id : id;
  const avatar = `${USER_CONTENT_URL}/${AVATAR}/${sanitizeDStorageUrl(
    profile.picture?.original?.url ?? profile.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
  )}`;
  const attachment = hasMedia ? sanitizeDStorageUrl(metadata?.media[0].original.url) : null;

  // Stats
  const commentsCount = isMirror
    ? publication.mirrorOf.stats.totalAmountOfComments
    : stats.totalAmountOfComments;
  const likesCount = isMirror ? publication.mirrorOf.stats.totalUpvotes : stats.totalUpvotes;
  const collectsCount = isMirror
    ? publication.mirrorOf.stats.totalAmountOfCollects
    : stats.totalAmountOfCollects;
  const mirrorsCount = isMirror
    ? publication.mirrorOf.stats.totalAmountOfMirrors
    : stats.totalAmountOfMirrors;

  return (
    <>
      <div>
        <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>
          <img alt={`@${formatHandle(profile.handle)}'s avatar`} src={avatar} width="64" />
        </a>
      </div>
      <div>
        <div>
          <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>{profile.name ?? profile.handle}</a>
        </div>
        <div>
          <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>@{formatHandle(profile.handle)}</a>
        </div>
        {h1Content ? (
          <h1>
            <a href={`${BASE_URL}/posts/${publicationId}`}>{metadata.content ?? ''}</a>
          </h1>
        ) : (
          <div>
            <a href={`${BASE_URL}/posts/${publicationId}`}>{metadata.content ?? ''}</a>
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
        {publication.collectModule.__typename !== 'RevertCollectModuleSettings' ? (
          <div>{collectsCount} Collects</div>
        ) : null}
        <div>{mirrorsCount} Mirrors</div>
        <hr />
      </div>
    </>
  );
};

export default SinglePublication;
