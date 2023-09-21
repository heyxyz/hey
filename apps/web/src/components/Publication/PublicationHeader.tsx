import SmallUserProfile from '@components/Shared/SmallUserProfile';
import UserProfile from '@components/Shared/UserProfile';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedItem } from '@lenster/lens';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import cn from '@lenster/ui/cn';
import type { FC } from 'react';
import { usePreferencesStore } from 'src/store/preferences';
import { usePublicationStore } from 'src/store/publication';

import PublicationMenu from './Actions/Menu';
import Source from './Source';

interface PublicationHeaderProps {
  publication: AnyPublication;
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
  const gardenerMode = usePreferencesStore((state) => state.gardenerMode);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem
    ? firstComment
      ? firstComment
      : feedItem?.root
    : targetPublication;
  const profile = feedItem ? rootPublication.by : publication.by;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : targetPublication.createdAt;

  return (
    <div
      className={cn(
        quoted ? 'pb-2' : 'pb-4',
        'relative flex justify-between space-x-1.5'
      )}
      data-testid={`publication-${publication.id}-header`}
    >
      <span
        className="max-w-full"
        onClick={stopEventPropagation}
        aria-hidden="true"
      >
        {quoted ? (
          <SmallUserProfile profile={profile} timestamp={timestamp} />
        ) : (
          <UserProfile profile={profile} timestamp={timestamp} showStatus />
        )}
      </span>
      <div className="!-mr-[7px] flex items-center space-x-1">
        {gardenerMode ? <Source publication={targetPublication} /> : null}
        {!publication.isHidden && !quoted ? (
          <PublicationMenu publication={publication} />
        ) : null}
        {quoted && isNew ? (
          <button
            className="rounded-full border p-1.5 hover:bg-gray-300/20"
            onClick={(event) => {
              stopEventPropagation(event);
              setQuotedPublication(null);
            }}
            aria-label="Remove Quote"
          >
            <XMarkIcon className="lt-text-gray-500 w-[15px] sm:w-[18px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PublicationHeader;
