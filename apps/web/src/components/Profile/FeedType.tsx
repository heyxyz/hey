import TabButton from '@components/UI/TabButton';
import {
  ChatAlt2Icon,
  CollectionIcon,
  FilmIcon,
  PencilAltIcon,
  PhotographIcon
} from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { PROFILE } from 'src/tracking';

import { ProfileFeedType } from './Feed';
import MediaFilter from './Filters/MediaFilter';

interface Props {
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex overflow-x-auto gap-3 px-5 pb-2 mt-3 sm:px-0 sm:mt-0 md:pb-0">
        <TabButton
          name={t`Feed`}
          icon={<PencilAltIcon className="w-4 h-4" />}
          active={feedType === ProfileFeedType.Feed}
          type="feed"
          onClick={() => {
            setFeedType(ProfileFeedType.Feed);
            Analytics.track(PROFILE.SWITCH_FEED);
          }}
        />
        <TabButton
          name={t`Replies`}
          icon={<ChatAlt2Icon className="w-4 h-4" />}
          active={feedType === ProfileFeedType.Replies}
          type="replies"
          onClick={() => {
            setFeedType(ProfileFeedType.Replies);
            Analytics.track(PROFILE.SWITCH_REPLIES);
          }}
        />
        <TabButton
          name={t`Media`}
          icon={<FilmIcon className="w-4 h-4" />}
          active={feedType === ProfileFeedType.Media}
          type="media"
          onClick={() => {
            setFeedType(ProfileFeedType.Media);
            Analytics.track(PROFILE.SWITCH_MEDIA);
          }}
        />
        <TabButton
          name={t`Collected`}
          icon={<CollectionIcon className="w-4 h-4" />}
          active={feedType === ProfileFeedType.Collects}
          type="collects"
          onClick={() => {
            setFeedType(ProfileFeedType.Collects);
            Analytics.track(PROFILE.SWITCH_MEDIA);
          }}
        />
        <TabButton
          name={t`NFTs`}
          icon={<PhotographIcon className="w-4 h-4" />}
          active={feedType === ProfileFeedType.Nft}
          type="nft"
          onClick={() => {
            setFeedType(ProfileFeedType.Nft);
            Analytics.track(PROFILE.SWITCH_NFTS);
          }}
        />
      </div>
      <div>{feedType === ProfileFeedType.Media && <MediaFilter />}</div>
    </div>
  );
};

export default FeedType;
