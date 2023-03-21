import TabButton from '@components/UI/TabButton';
import {
  ChatAlt2Icon,
  CollectionIcon,
  FilmIcon,
  PencilAltIcon,
  PhotographIcon
} from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { ProfileFeedType } from 'src/enums';
import { PROFILE } from 'src/tracking';

import MediaFilter from './Filters/MediaFilter';

interface FeedTypeProps {
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const switchTab = (type: string) => {
    setFeedType(type);
    Mixpanel.track(PROFILE.SWITCH_PROFILE_FEED_TAB, {
      profile_feed_type: type.toLowerCase()
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          name={t`Feed`}
          icon={<PencilAltIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Feed}
          type={ProfileFeedType.Feed.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Feed)}
        />
        <TabButton
          name={t`Replies`}
          icon={<ChatAlt2Icon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Replies}
          type={ProfileFeedType.Replies.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Replies)}
        />
        <TabButton
          name={t`Media`}
          icon={<FilmIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Media}
          type={ProfileFeedType.Media.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Media)}
        />
        <TabButton
          name={t`Collected`}
          icon={<CollectionIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Collects}
          type={ProfileFeedType.Collects.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Collects)}
        />
        <TabButton
          name={t`NFTs`}
          icon={<PhotographIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Nft}
          type={ProfileFeedType.Nft.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Nft)}
        />
      </div>
      <div>{feedType === ProfileFeedType.Media && <MediaFilter />}</div>
    </div>
  );
};

export default FeedType;
