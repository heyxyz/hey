import { FeatureFlag } from '@lenster/data/feature-flags';
import type { MetadataOutput } from '@lenster/lens';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import getChannelByTag from '@lib/getChannelByTag';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

interface FeaturedChannelProps {
  tags: MetadataOutput['tags'];
  className?: string;
}

const FeaturedChannel: FC<FeaturedChannelProps> = ({
  tags,
  className = ''
}) => {
  const isChannelsEnabled = isFeatureEnabled(FeatureFlag.Channels);
  const channel = getChannelByTag(tags);

  if (!channel || !isChannelsEnabled) {
    return null;
  }

  return (
    <Link
      href={`/c/${channel.slug}`}
      className={clsx(
        'flex items-center space-x-2 text-xs hover:underline',
        className
      )}
      onClick={(e) => stopEventPropagation(e)}
    >
      <img src={channel.avatar} className="h-4 w-4 rounded" />
      <div className="font-bold">{channel.name}</div>
    </Link>
  );
};

export default FeaturedChannel;
