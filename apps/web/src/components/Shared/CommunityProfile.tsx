import getAvatar from '@lenster/lib/getAvatar';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import type { Community } from '@lenster/types/communities';
import { Image } from '@lenster/ui';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import Slug from './Slug';

interface CommunityProfileProps {
  community: Community;
}

const CommunityProfile: FC<CommunityProfileProps> = ({ community }) => {
  const CommunityAvatar = () => (
    <Image
      src={getAvatar(community)}
      loading="lazy"
      className="h-10 w-10 rounded-lg border bg-gray-200 dark:border-gray-700"
      height={40}
      width={40}
      alt={community?.slug}
    />
  );

  const CommunityName = () => (
    <div>
      <div className="max-w-sm items-center truncate">
        {sanitizeDisplayName(community?.name) ?? community?.slug}
      </div>
      <Slug className="text-sm" slug={community?.slug} prefix="/c/" />
    </div>
  );

  return (
    <div
      className="flex items-center justify-between"
      data-testid={`community-profile-${community.id}`}
    >
      <Link
        href={`/c/${community?.slug}`}
        className="mr-8 flex items-center space-x-3"
      >
        <CommunityAvatar />
        <CommunityName />
      </Link>
    </div>
  );
};

export default memo(CommunityProfile);
