import type { PublicationMetadata } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import cn from '@lenster/ui/cn';
import getChannelByTag from '@lib/getChannelByTag';
import Link from 'next/link';
import type { FC } from 'react';

interface FeaturedChannelProps {
  tags: PublicationMetadata['tags'];
  className?: string;
}

const FeaturedChannel: FC<FeaturedChannelProps> = ({
  tags,
  className = ''
}) => {
  const channel = getChannelByTag(tags || []);

  if (!channel) {
    return null;
  }

  return (
    <Link
      href={`/c/${channel.slug}`}
      className={cn(
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
