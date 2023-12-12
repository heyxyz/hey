import type { AnyPublication, FeedItem } from '@hey/lens';
import type { FC } from 'react';

import SmallUserProfile from '@components/Shared/SmallUserProfile';
import UserProfile from '@components/Shared/UserProfile';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import PublicationMenu from './Actions/Menu';
import Source from './Source';

interface PublicationHeaderProps {
  feedItem?: FeedItem;
  isNew?: boolean;
  publication: AnyPublication;
  quoted?: boolean;
}

const PublicationHeader: FC<PublicationHeaderProps> = ({
  feedItem,
  isNew = false,
  publication,
  quoted = false
}) => {
  const setQuotedPublication = usePublicationStore(
    (state) => state.setQuotedPublication
  );
  const gardenerMode = useFeatureFlagsStore((state) => state.gardenerMode);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const firstComment = feedItem?.comments?.[0];
  const rootPublication = feedItem
    ? firstComment
      ? firstComment
      : feedItem?.root
    : targetPublication;
  const profile = feedItem ? rootPublication.by : targetPublication.by;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : targetPublication.createdAt;

  return (
    <div
      className={cn(
        quoted ? 'pb-2' : 'pb-4',
        'relative flex justify-between space-x-1.5'
      )}
    >
      <span className="max-w-full" onClick={stopEventPropagation}>
        {quoted ? (
          <SmallUserProfile
            linkToProfile
            profile={profile}
            timestamp={timestamp}
          />
        ) : (
          <UserProfile profile={profile} timestamp={timestamp} />
        )}
      </span>
      <div className="flex items-center space-x-1">
        {gardenerMode ? <Source publication={targetPublication} /> : null}
        {!publication.isHidden && !quoted ? (
          <PublicationMenu publication={targetPublication} />
        ) : null}
        {quoted && isNew ? (
          <button
            aria-label="Remove Quote"
            className="outline-brand-500 rounded-full border p-1.5 hover:bg-gray-300/20"
            onClick={(event) => {
              stopEventPropagation(event);
              setQuotedPublication(null);
            }}
            type="reset"
          >
            <XMarkIcon className="ld-text-gray-500 w-[15px] sm:w-[18px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PublicationHeader;
