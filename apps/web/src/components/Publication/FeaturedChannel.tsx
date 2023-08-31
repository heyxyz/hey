import type { MetadataOutput } from '@lenster/lens';
import getChannelByTag from '@lib/getChannelByTag';
import type { FC } from 'react';

interface FeaturedChannelProps {
  tags: MetadataOutput['tags'];
}

const FeaturedChannel: FC<FeaturedChannelProps> = ({ tags }) => {
  const channel = getChannelByTag(tags);

  if (!channel) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center space-x-2 text-xs">
      <img src={channel.avatar} className="h-4 w-4 rounded" />
      <div className="font-bold">{channel.name}</div>
    </div>
  );
};

export default FeaturedChannel;
