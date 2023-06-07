import SmallUserProfile from '@components/Shared/SmallUserProfile';
import UserProfile from '@components/Shared/UserProfile';
import useModMode from '@components/utils/hooks/useModMode';
import { XIcon } from '@heroicons/react/outline';
import type { FeedItem, Publication } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';

import PublicationMenu from './Actions/Menu';
import Source from './Source';

interface PublicationHeaderProps {
  publication: Publication;
  feedItem?: FeedItem;
  quoted?: boolean;
  isNew?: boolean;
}

const PublicationHeader: FC<PublicationHeaderProps> = ({
  publication,
  feedItem,
  quoted = false,
  isNew = false
}) => {
  const setQuotedPublication = usePublicationStore(
    (state) => state.setQuotedPublication
  );
  const { allowed: modMode } = useModMode();
  const isMirror = publication.__typename === 'Mirror';
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem
    ? firstComment
      ? firstComment
      : feedItem?.root
    : publication;
  const profile = feedItem
    ? rootPublication.profile
    : isMirror
    ? publication?.mirrorOf?.profile
    : publication?.profile;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : isMirror
    ? publication?.mirrorOf?.createdAt
    : publication?.createdAt;

  return (
    <div
      className="relative flex justify-between space-x-1.5 pb-4"
      data-testid={`publication-${publication.id}-header`}
    >
      <span onClick={stopEventPropagation} aria-hidden="true">
        {quoted ? (
          <SmallUserProfile profile={profile} timestamp={timestamp} />
        ) : (
          <UserProfile profile={profile} timestamp={timestamp} showStatus />
        )}
      </span>
      <div className="!-mr-[7px] flex items-center space-x-1">
        {modMode && <Source publication={publication} />}
        {!publication.hidden && !quoted && (
          <PublicationMenu publication={publication} />
        )}
        {quoted && isNew && (
          <button
            className="rounded-full border p-1.5 hover:bg-gray-300/20"
            onClick={(event) => {
              stopEventPropagation(event);
              setQuotedPublication(null);
            }}
            aria-label="Remove Quote"
          >
            <XIcon className="lt-text-gray-500 w-[15px] sm:w-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PublicationHeader;
