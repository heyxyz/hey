import TabButton from '@components/UI/TabButton';
import type { ProfileStats } from '@generated/types';
import { ChatAlt2Icon, FilmIcon, PencilAltIcon, PhotographIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC } from 'react';

interface Props {
  stats: ProfileStats;
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<Props> = ({ stats, setFeedType, feedType }) => {
  return (
    <div className="flex overflow-x-auto gap-3 px-5 pb-2 mt-3 sm:px-0 sm:mt-0 md:pb-0">
      <TabButton
        name="Feed"
        icon={<PencilAltIcon className="w-4 h-4" />}
        active={feedType === 'FEED'}
        count={stats?.totalPosts + stats?.totalMirrors}
        onClick={() => {
          setFeedType('FEED');
          Leafwatch.track(`Switch to feed tab in profile`);
        }}
      />
      <TabButton
        name="Replies"
        icon={<ChatAlt2Icon className="w-4 h-4" />}
        active={feedType === 'REPLIES'}
        count={stats?.totalComments}
        onClick={() => {
          setFeedType('REPLIES');
          Leafwatch.track(`Switch to replies tab in profile`);
        }}
      />
      <TabButton
        name="Media"
        icon={<FilmIcon className="w-4 h-4" />}
        active={feedType === 'MEDIA'}
        onClick={() => {
          setFeedType('MEDIA');
          Leafwatch.track(`Switch to media tab in profile`);
        }}
      />
      <TabButton
        name="NFTs"
        icon={<PhotographIcon className="w-4 h-4" />}
        active={feedType === 'NFT'}
        onClick={() => {
          setFeedType('NFT');
          Leafwatch.track(`Switch to nft tab in profile`);
        }}
      />
    </div>
  );
};

export default FeedType;
