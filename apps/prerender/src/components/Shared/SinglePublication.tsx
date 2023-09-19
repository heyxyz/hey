import type { AnyPublication, Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
import truncateByWords from '@lenster/lib/truncateByWords';
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
  const { id, stats, metadata, __typename } = publication;
  const hasMedia = metadata?.media.length;
  const isMirror = __typename === 'Mirror';
  const profile: Profile = isMirror
    ? publication?.mirrorOn?.by
    : publication?.profile;
  const publicationId = isMirror ? publication?.mirrorOn?.id : id;
  const avatar = sanitizeDStorageUrl(
    profile.picture?.original?.url ??
      profile.picture?.uri ??
      getStampFyiURL(profile?.ownedBy.address)
  );
  const attachment = hasMedia
    ? sanitizeDStorageUrl(metadata?.media[0].original.url)
    : null;
  const content = truncateByWords(metadata?.content, 30);

  // Stats
  const commentsCount = isMirror
    ? publication.mirrorOn.stats.comments
    : stats.totalAmountOfComments;
  const likesCount = isMirror
    ? publication.mirrorOn.stats.reactions
    : stats.totalUpvotes;
  const collectsCount = isMirror
    ? publication.mirrorOn.stats.countOpenActions
    : stats.totalAmountOfCollects;
  const mirrorsCount = isMirror
    ? publication.mirrorOn.stats.mirrors
    : stats.totalAmountOfMirrors;

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
        {publication.collectModule.__typename !==
        'RevertCollectModuleSettings' ? (
          <div>{collectsCount} Collects</div>
        ) : null}
        <div>{mirrorsCount} Mirrors</div>
        <hr />
      </div>
    </>
  );
};

export default SinglePublication;
