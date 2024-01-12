import type { PublicationMetadata } from '@hey/lens';
import type { FC } from 'react';

import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import getGroupByTag from '@lib/getGroupByTag';
import Link from 'next/link';

interface FeaturedGroupProps {
  className?: string;
  tags: PublicationMetadata['tags'];
}

const FeaturedGroup: FC<FeaturedGroupProps> = ({ className = '', tags }) => {
  const group = getGroupByTag(tags || []);

  if (!group) {
    return null;
  }

  return (
    <Link
      className={cn(
        'flex items-center space-x-2 text-xs hover:underline',
        className
      )}
      href={`/g/${group.slug}`}
      onClick={(e) => stopEventPropagation(e)}
    >
      <img alt={group.name} className="size-4 rounded" src={group.avatar} />
      <div className="font-bold">{group.name}</div>
    </Link>
  );
};

export default FeaturedGroup;
