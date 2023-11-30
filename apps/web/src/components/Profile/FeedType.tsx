import { ProfileFeedType } from '@enums';
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  FilmIcon,
  PencilSquareIcon,
  RectangleGroupIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@hey/data/constants';
import { PROFILE } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type FC } from 'react';

import MediaFilter from './Filters/MediaFilter';

interface FeedTypeProps {
  feedType: string;
}

const FeedType: FC<FeedTypeProps> = ({ feedType }) => {
  const switchTab = (type: string) => {
    if (type === ProfileFeedType.Stats.toLowerCase()) {
      Leafwatch.track(PROFILE.SWITCH_PROFILE_STATS_TAB);
    } else {
      Leafwatch.track(PROFILE.SWITCH_PROFILE_FEED_TAB, {
        profile_feed_type: type.toLowerCase()
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          name="Feed"
          icon={<PencilSquareIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Feed}
          type={ProfileFeedType.Feed.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Feed)}
        />
        <TabButton
          name="Replies"
          icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Replies}
          type={ProfileFeedType.Replies.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Replies)}
        />
        <TabButton
          name="Media"
          icon={<FilmIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Media}
          type={ProfileFeedType.Media.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Media)}
        />
        <TabButton
          name="Collected"
          icon={<RectangleStackIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Collects}
          type={ProfileFeedType.Collects.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Collects)}
        />
        <TabButton
          name="Gallery"
          icon={<RectangleGroupIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Gallery}
          type={ProfileFeedType.Gallery.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Gallery)}
        />
        {IS_MAINNET ? (
          <TabButton
            name="Stats"
            icon={<ChartBarIcon className="h-4 w-4" />}
            active={feedType === ProfileFeedType.Stats}
            type={ProfileFeedType.Stats.toLowerCase()}
            onClick={() => switchTab(ProfileFeedType.Stats)}
          />
        ) : null}
      </div>
      {feedType === ProfileFeedType.Media ? <MediaFilter /> : null}
    </div>
  );
};

export default FeedType;
