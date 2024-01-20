import type { AnyPublication, FeedItem } from '@hey/lens';
import type { FC } from 'react';

import PublicationProfile from '@components/Publication/PublicationProfile';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import PublicationMenu from './Actions/Menu';

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
  const rootPublication = feedItem ? feedItem?.root : targetPublication;
  const profile = feedItem ? rootPublication.by : targetPublication.by;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : targetPublication.createdAt;

  return (
    <div
      className="flex justify-between space-x-1.5"
      onClick={stopEventPropagation}
    >
      <PublicationProfile
        profile={profile}
        source={gardenerMode ? targetPublication.publishedOn?.id : undefined}
        timestamp={timestamp}
      />
      {!publication.isHidden && !quoted ? (
        <PublicationMenu publication={targetPublication} />
      ) : null}
      {quoted && isNew ? (
        <button
          aria-label="Remove Quote"
          className="outline-brand-500 rounded-full border p-1 hover:bg-gray-300/20"
          onClick={() => setQuotedPublication(null)}
          type="reset"
        >
          <XMarkIcon className="ld-text-gray-500 size-3.5" />
        </button>
      ) : null}
    </div>
  );
};

export default PublicationHeader;
