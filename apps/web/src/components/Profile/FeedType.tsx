import TabButton from '@components/UI/TabButton';
import { ChatAlt2Icon, FilmIcon, PencilAltIcon, PhotographIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import type { ProfileStats } from 'lens';
import type { Dispatch, FC } from 'react';
import { PROFILE } from 'src/tracking';

import MediaFilter from './Filters/MediaFilter';

interface Props {
  stats: ProfileStats;
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<Props> = ({ stats, setFeedType, feedType }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex overflow-x-auto gap-3 px-5 pb-2 mt-3 sm:px-0 sm:mt-0 md:pb-0">
        <TabButton
          name="Feed"
          icon={<PencilAltIcon className="w-4 h-4" />}
          active={feedType === 'FEED'}
          count={stats?.totalPosts + stats?.totalMirrors}
          onClick={() => {
            setFeedType('FEED');
            Analytics.track(PROFILE.SWITCH_FEED);
          }}
        />
        <TabButton
          name="Replies"
          icon={<ChatAlt2Icon className="w-4 h-4" />}
          active={feedType === 'REPLIES'}
          count={stats?.totalComments}
          onClick={() => {
            setFeedType('REPLIES');
            Analytics.track(PROFILE.SWITCH_REPLIES);
          }}
        />
        <TabButton
          name="Media"
          icon={<FilmIcon className="w-4 h-4" />}
          active={feedType === 'MEDIA'}
          onClick={() => {
            setFeedType('MEDIA');
            Analytics.track(PROFILE.SWITCH_MEDIA);
          }}
        />
        <TabButton
          name="NFTs"
          icon={<PhotographIcon className="w-4 h-4" />}
          active={feedType === 'NFT'}
          onClick={() => {
            setFeedType('NFT');
            Analytics.track(PROFILE.SWITCH_NFTS);
          }}
        />
      </div>
      <div>{feedType === 'MEDIA' && <MediaFilter />}</div>
    </div>
  );
};

export default FeedType;
