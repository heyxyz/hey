import type { Dispatch, FC, SetStateAction } from 'react';

import { EXPLORE } from '@good/data/tracking';
import { PublicationMetadataMainFocusType } from '@good/lens';
import cn from '@good/ui/cn';
import { Leafwatch } from '@helpers/leafwatch';

interface FeedLinkProps {
  name: string;
  type?: PublicationMetadataMainFocusType;
}

interface FeedFocusTypeProps {
  focus?: PublicationMetadataMainFocusType;
  setFocus: Dispatch<
    SetStateAction<PublicationMetadataMainFocusType | undefined>
  >;
}

const FeedFocusType: FC<FeedFocusTypeProps> = ({ focus, setFocus }) => {
  const FeedLink: FC<FeedLinkProps> = ({ name, type }) => (
    <button
      aria-label={name}
      className={cn(
        focus === type ? 'bg-black text-white' : 'bg-gray-100 dark:bg-gray-800',
        'rounded-full px-3 py-1.5 text-xs sm:px-4',
        'border border-gray-300 dark:border-gray-500'
      )}
      onClick={() => {
        setFocus(type as PublicationMetadataMainFocusType);
        Leafwatch.track(EXPLORE.SWITCH_EXPLORE_FEED_FOCUS, {
          explore_feed_focus: (type || 'all_posts').toLowerCase()
        });
      }}
      type="button"
    >
      {name}
    </button>
  );

  return (
    <div className="mx-5 my-5 flex flex-wrap gap-3 sm:mx-0">
      <FeedLink name="All posts" />
      <FeedLink name="Text" type={PublicationMetadataMainFocusType.TextOnly} />
      <FeedLink name="Video" type={PublicationMetadataMainFocusType.Video} />
      <FeedLink name="Audio" type={PublicationMetadataMainFocusType.Audio} />
      <FeedLink name="Images" type={PublicationMetadataMainFocusType.Image} />
    </div>
  );
};

export default FeedFocusType;
